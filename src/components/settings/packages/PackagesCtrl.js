angular.module('quote')
	.controller('PackagesCtrl', PackagesCtrl);

function PackagesCtrl($scope, DataSvc) {

	var vm = this;

	vm.addPackage = addPackage;
	vm.removePackage = removePackage;
	vm.packagesAll;
	vm.packagesOwn;
	vm.packagesSubscribed;

	init();

	function init() {
		vm.packagesAll = DataSvc.getPackagesAll();
		vm.packagesOwn = DataSvc.getPackagesOwn($scope.authStatus.uid);
		vm.packagesSubscribed = DataSvc.getPackagesSubscribed($scope.authStatus.uid);
	}

	/**
	 * Subscribe to package
	 * @param {String} key push key ($id) of package
	 */
	function addPackage(key) {
		DataSvc.subscribePackage($scope.authStatus.uid, key).then(function() {
		}, function(err) {
			console.log('error subscribing to package:', err);
		});
	}

	/**
	 * Unsubscribe from package
	 * @param  {String} key push key ($id) of package
	 */
	function removePackage(key) {
		DataSvc.unsubscribePackage($scope.authStatus.uid, key).then(function() {
		}, function(err) {
			console.log('error unsubscribing to package:', err);
		});
	}

}