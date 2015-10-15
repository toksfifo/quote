angular.module('quote')
	.controller('PackagesCtrl', PackagesCtrl);

function PackagesCtrl(DataSvc) {

	var vm = this;

	vm.filter = {
		created: false,
		search: ''
	};
	vm.packagesAll;
	vm.packagesOwn;
	vm.packagesSubscribed;

	init();

	function init() {
		vm.packagesAll = DataSvc.getPackagesAll();
		vm.packagesOwn = DataSvc.getPackagesOwn();
		vm.packagesSubscribed = DataSvc.getPackagesSubscribed();
	}

}