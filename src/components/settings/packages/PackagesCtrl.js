angular.module('quote')
	.controller('PackagesCtrl', PackagesCtrl);

function PackagesCtrl(AuthSvc, DataSvc) {

	var vm = this;

	vm.addPackage = addPackage;
	vm.removePackage = removePackage;
	vm.packagesAll;
	vm.packagesOwn;
	vm.packagesSubscribed;

	init();

	function init() {
		vm.packagesAll = DataSvc.getPackagesAll();
		vm.packagesOwn = DataSvc.getPackagesOwn(AuthSvc.getAuthStatus().uid);
		vm.packagesSubscribed = DataSvc.getPackagesSubscribed(AuthSvc.getAuthStatus().uid);
	}

	/**
	 * Subscribe to package
	 * @param {String} key push key ($id) of package
	 */
	function addPackage(key) {
		DataSvc.subscribePackage(AuthSvc.getAuthStatus().uid, key).then(function() {
		}, function(err) {
			console.log('error subscribing to package:', err);
		});
	}

	/**
	 * Unsubscribe from package
	 * @param  {String} key push key ($id) of package
	 */
	function removePackage(key) {
		DataSvc.unsubscribePackage(AuthSvc.getAuthStatus().uid, key).then(function() {
		}, function(err) {
			console.log('error unsubscribing to package:', err);
		});
	}

}