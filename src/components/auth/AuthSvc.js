angular.module('quote')
	.factory('AuthSvc', AuthSvc);

function AuthSvc($q, $firebaseAuth, Const, UserSvc) {

	var auth = $firebaseAuth(Const.ref);
	var authStatus;

	var AuthSvc = {
		checkAuth: checkAuth,
		signupAnon: signupAnon,
		logout: logout,
		getAuthStatus: getAuthStatus,
		setAuthStatus: setAuthStatus
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
				return UserSvc.createUser(authData);
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
}