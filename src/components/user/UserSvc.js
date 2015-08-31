angular.module('quote')
	.factory('UserSvc', UserSvc);

function UserSvc($firebaseObject, $q, Const) {

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
			var newUser = $firebaseObject(Const.ref.child('users').child(uid));
			newUser.color = 'blue';
			newUser.$save().then(function(user) {
				resolve(user.key());
			}, function(err) {
				console.error('createUser failed on save:', err);
				reject(err);
			});
		});

		
	}
}