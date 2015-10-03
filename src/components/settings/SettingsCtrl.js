angular.module('quote')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl() {

	var vm = this;

	vm.showPackages = false;
	vm.showColors = true;
	vm.showAccount = false;

}