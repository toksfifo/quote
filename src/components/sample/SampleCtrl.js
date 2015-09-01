angular.module('quote')
	.controller('SampleCtrl', SampleCtrl);

SampleCtrl.resolve = {
	authStatus: function(AuthSvc) {
		return AuthSvc.checkAuth();
	}
}

function SampleCtrl(Const, $firebaseArray, $firebaseObject, AuthSvc, $scope, authStatus, $timeout) {

	var vm = this;
	var currentPackageID;

	vm.createPackage = createPackage;
	vm.addQuote = addQuote;
	vm.savePackage = savePackage;
	vm.quote = {
		/**
		 * body
		 * text
		 * link
		 */
	};
	vm.packageName;
	vm.addPackage = addPackage;
	
	$scope.packages;

	if (authStatus) {
		console.log('already logged in as: ', authStatus);
		// AuthSvc.logout();
	} else {
		AuthSvc.signupAnon().then(function(authData) {
			console.log('logged in anonymously: ', authData);
		});
	}

	$firebaseObject(Const.ref.child('packages')).$bindTo($scope, 'packages');

	function createPackage() {
		var packages = Const.ref.child('packages');
		currentPackageID = packages.push({
			name: 'default',
			creator: AuthSvc.getUid()
		}, function(package) {
			currentPackageID = currentPackageID.key();
		});
	}

	function addQuote() {
		var quotesOfPackage = Const.ref.child('quotes').child(currentPackageID);
		quotesOfPackage.push({
			body: vm.quote.body,
			author: vm.quote.author,
			link: vm.quote.link
		}, function() {
			vm.quote.body = '';
			vm.quote.author = '';
			vm.quote.link = '';
		});
	}

	function savePackage() {
		var package = Const.ref.child('packages').child(currentPackageID);
		package.update({
			name: vm.packageName
		}, function(err) {
			vm.packageName = '';
		});
	}

	function addPackage(key) {
		Const.ref.child('users')
			.child(AuthSvc.getUid())
			.child('packages')
			.child('current')
			.child(key)
			.set(true);
	}
}