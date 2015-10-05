angular.module('quote')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl() {

	var vm = this;

	vm.toggleTab = toggleTab;

	vm.show = {
		packages: false,
		colors: true,
		account: false
	};

	function toggleTab(tab) {
		for (var key in vm.show) {
			if (vm.show.hasOwnProperty(key)) {
				vm.show[key] = false;
			}
		}
		vm.show[tab] = true;
	}

}