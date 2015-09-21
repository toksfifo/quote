angular.module('quote')
	.factory('UserSvc', UserSvc);

function UserSvc($q, Const) {

	var UserSvc = {
		createUser: createUser
	};

	return UserSvc;

	/**
	 * Add user to db/users
	 * @param  {String} uid User's unique ID
	 * @return {Promise}     Resolves when user is saved to db
	 */
	function createUser(uid) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(uid)
				.set({ color: 'blue' }, function(err) {
					if (err) {
						console.error('createUser failed on set:', err);
						reject(err);
					} else {
						resolve(uid);
					}
				});
		});
	}
}