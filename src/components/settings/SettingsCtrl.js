angular.module('quote')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl() {

	var vm = this;

	vm.showPackages = true;
	vm.showColors = false;
	vm.showAccount = false;

}