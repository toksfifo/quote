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
		DataSvc.getPackagesAll().then(function(packages) {
			vm.packagesAll = packages;
			return DataSvc.getPackagesOwn($scope.authStatus.uid);
		}).then(function(packages) {
			vm.packagesOwn = packages;
			return DataSvc.getPackagesSubscribed($scope.authStatus.uid);
		}).then(function(packages) {
			vm.packagesSubscribed = packages;
		}).catch(function(err) {
			console.log('error getting packages:', err);
		});
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