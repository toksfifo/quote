angular.module('quote')
	.controller('ColorsCtrl', ColorsCtrl);

function ColorsCtrl(DataSvc, AuthSvc) {

	var vm = this;

	vm.colors = DataSvc.getColorOptions();
	vm.currentColor = DataSvc.getColor(AuthSvc.getAuthStatus().uid);
	vm.selectColor = selectColor;

	/**
	 * Set new background color
	 * @param  {Object} color new color
	 */
	function selectColor(color) {
		DataSvc.setColor(AuthSvc.getAuthStatus().uid, color).then(function() {

		}, function(err) {
			console.log('error setting color', err);
		});
	}
	
}