angular.module('quote')
	.factory('AuthSvc', AuthSvc);

function AuthSvc($q, $firebaseAuth, Const, UserSvc) {

	var auth = $firebaseAuth(Const.ref);
	var uid = null;

	// set uid on auth
	auth.$onAuth(function(authData) {
		uid = authData ? authData.uid : null;
	});

	var AuthSvc = {
		checkAuth: checkAuth,
		getUid: getUid,
		signupAnon: signupAnon,
		logout: logout
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
	 * Get current user's unique ID
	 * @return {String} uid || null
	 */
	function getUid() {
		return uid;
	}

	/**
	 * Sign up anonymously
	 * @return {Promise} Resolves after new user has been created
	 */
	function signupAnon() {
		return $q(function(resolve, reject) {
			auth.$authAnonymously().then(function(authData) {
				return UserSvc.createUser(authData.uid);
			}, function(err) {
				console.error('authAnonymously failed: ', err);
				reject(err);
			}).then(function(user) {
				resolve(user);
			});
		});
	}

	/**
	 * Logout
	 */
	function logout() {
		auth.$unauth();
	}
}