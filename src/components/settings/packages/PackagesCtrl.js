angular.module('quote')
	.controller('PackagesCtrl', PackagesCtrl);

function PackagesCtrl(AuthSvc, DataSvc) {

	var vm = this;

	vm.packagesAll;
	vm.packagesOwn;
	vm.packagesSubscribed;

	init();

	function init() {
		vm.packagesAll = DataSvc.getPackagesAll();
		vm.packagesOwn = DataSvc.getPackagesOwn(AuthSvc.getAuthStatus().uid);
		vm.packagesSubscribed = DataSvc.getPackagesSubscribed(AuthSvc.getAuthStatus().uid);
	}

}