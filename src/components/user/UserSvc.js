angular.module('quote')
	.factory('UserSvc', UserSvc);

function UserSvc($q, Const) {

	var UserSvc = {
		createUser: createUser
	};

	return UserSvc;

	/**
	 * Add user to db/users
	 * @param  {Object} authData User's auth data
	 * @return {Promise}     Resolves with auth data when user is saved to db
	 */
	function createUser(authData) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(authData.uid)
				.set({
					info: { name: 'anon frog' },
					color: { name: 'blue-pastel' }
				}, function(err) {
					if (err) {
						reject(err);
					} else {
						resolve(authData);
					}
				});
		});
	}
}