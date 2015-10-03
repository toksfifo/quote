angular.module('quote')
	.controller('ColorsCtrl', ColorsCtrl);

function ColorsCtrl($scope, DataSvc) {

	var vm = this;

	vm.selectColor = selectColor;
	vm.colors = [
		{
			name: 'redPastel',
			val: 'rgba(255, 105, 97, 1.0)'
		},
		{
			name: 'greenPastel',
			val: 'rgba(119, 190, 119, 1.0)'
		},
		{
			name: 'bluePastelDark',
			val: 'rgba(119, 158, 203, 1.0)'
		},
		{
			name: 'grayPastel',
			val: 'rgba(207, 207, 196, 1.0)'
		},
		{
			name: 'white',
			val: 'rgba(255, 255, 255, 1.0)'
		}
	];

	/**
	 * Set new background color
	 * @param  {Object} color new color
	 */
	function selectColor(color) {
		DataSvc.setColor($scope.authStatus.uid, color).then(function() {

		}, function(err) {
			console.log('error setting color', err);
		});
	}
}