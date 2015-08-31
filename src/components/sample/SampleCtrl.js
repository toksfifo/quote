angular.module('quote')
	.controller('SampleCtrl', SampleCtrl);

SampleCtrl.resolve = {
	authStatus: function(AuthSvc) {
		return AuthSvc.checkAuth();
	}
}

function SampleCtrl(Const, $firebaseArray, AuthSvc, $scope, authStatus) {

	if (authStatus) {
		console.log('already logged in as: ', authStatus);
		// AuthSvc.logout();
	} else {
		AuthSvc.signupAnon().then(function(authData) {
			console.log('logged in anonymously: ', authData);
		});
	}
}