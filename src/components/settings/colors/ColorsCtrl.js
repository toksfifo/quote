angular.module('quote')
	.controller('ColorsCtrl', ColorsCtrl);

function ColorsCtrl(DataSvc) {

	var vm = this;

	vm.colors = DataSvc.getColorOptions();
	vm.currentColor = DataSvc.getColor();
	vm.selectColor = selectColor;

	/**
	 * Set new background color
	 * @param  {Object} color new color
	 */
	function selectColor(color) {
		DataSvc.setColor(color).then(function() {

		}, function(err) {
			console.log('error setting color', err);
		});
	}
	
}