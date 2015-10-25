angular.module('quote')
	.factory('AuthSvc', AuthSvc);

function AuthSvc($q, $firebaseAuth, Const) {

	var auth = $firebaseAuth(Const.ref);
	var authStatus;

	var AuthSvc = {
		checkAuth: checkAuth,
		signupAnon: signupAnon,
		logout: logout,
		getAuthStatus: getAuthStatus,
		setAuthStatus: setAuthStatus,
		updateUsername: updateUsername
	};

	return AuthSvc;

	/**
	 * Check if user is authenticated
	 * @return {Promise} Resolves with authentication data || null
	 */
	function checkAuth() {
		return auth.$waitForAuth();
	}

	/**
	 * Sign up anonymously
	 * @return {Promise} Resolves after new user has been created
	 */
	function signupAnon() {
		return $q(function(resolve, reject) {
			auth.$authAnonymously().then(function(authData) {
				return createUser(authData);
			}, function(err) {
				reject(err);
			}).then(function(authData) {
				resolve(authData);
			});
		});
	}

	/**
	 * Logout
	 */
	function logout() {
		auth.$unauth();
	}

	/**
	 * Get auth status
	 * @return {Object} Auth stauts
	 */
	function getAuthStatus() {
		return authStatus;
	}

	/**
	 * Set auth status
	 * @param {Object} newAuthStatus new auth status
	 */
	function setAuthStatus(newAuthStatus) {
		authStatus = newAuthStatus;
	}

	/**
	 * Add user to db/users
	 * @param  {Object} authData User's auth data
	 * @return {Promise}     Resolves with auth data when user is saved to db
	 */
	function createUser(authData) {
		return $q(function(resolve, reject) {
			var dataCreateUser = {};
			generateAnonUsername().then(function(name) {
				dataCreateUser['users/' + authData.uid] = {
					info: { name: name },
					color: { name: 'gray' }
				};
				dataCreateUser['usernames/list/' + name] = true;
				Const.ref.update(dataCreateUser, function(err) {
					err ? reject(err) : resolve(authData);
				});
			});
		});
	}

	/**
	 * Create anonymous (unique) username
	 * @return {Promise} Resovles with new name generated
	 */
	function generateAnonUsername() {
		return $q(function(resolve, reject) {
			Const.ref.child('usernames/auto').once('value', function(namesRef) {
				var names = namesRef.val();
				var keys = Object.keys(names);
				var index = randomNumber(0, keys.length - 1);
				var name = keys[index];
				var nameGenerated = 'anon-' + keys[index] + names[name];

				// increment counter on db
				Const.ref.child('usernames/auto')
					.child(name)
					.set(names[name] + 1, function(err) {
						err ? reject(err) : resolve(nameGenerated);
					});
			});
		});
	}

	/**
	 * Update username. Also update names of all user's packages.
	 * @param  {String} name New name
	 * @return {Promise}      Resolves when everything is updated. Rejects if new name already exists for some other user
	 */
	function updateUsername(name) {
		return $q(function(resolve, reject) {
			var dataUpdateUsername = {};

			Const.ref.child('usernames/list').once('value', function(namesRef) {
				var names = namesRef.val();

				// only continue if name doesn't already exist (is unique)
				if (!names || !names[name]) {

					// get current name
					Const.ref.child('users')
						.child(authStatus.uid)
						.child('info/name').once('value', function(oldnameRef) {

							// get user's packages
							Const.ref.child('packages')
								.orderByChild('creator')
								.equalTo(authStatus.uid)
								.once('value', function(packagesRef) {

									var packages = packagesRef.val();
									if (packages) {
										// update names of all user's packages
										for (var i = 0, keys = Object.keys(packages); i < keys.length; i++) {
											var packageKey = keys[i];
											dataUpdateUsername['packages/' + packageKey + '/creatorName'] = name;
										}
									}

									// update user's name
									dataUpdateUsername['users/' + authStatus.uid + '/info/name'] = name;

									// add new name to names list
									dataUpdateUsername['usernames/list/' + name] = true;

									// remove old name from names list
									dataUpdateUsername['usernames/list/' + oldnameRef.val()] = null;

									Const.ref.update(dataUpdateUsername, function(err) {
										err ? reject(err) : resolve();
									});
								});
						});
				} else {
					// name already exists
					resolve(0);
				}
			});
		});
	}

	/**
	 * Generate random number from [min, max]
	 * @param  {Number} min min, inclusive
	 * @param  {Number} max max, inclusive
	 * @return {Number}     random number
	 */
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}