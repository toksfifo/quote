angular.module('quote')
	.factory('AuthSvc', AuthSvc);

function AuthSvc($q, $firebaseAuth, Const, UserSvc) {

	var auth = $firebaseAuth(Const.ref);

	var AuthSvc = {
		checkAuth: checkAuth,
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
}