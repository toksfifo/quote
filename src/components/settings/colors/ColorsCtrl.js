angular.module('quote')
	.controller('ColorsCtrl', ColorsCtrl);

function ColorsCtrl($scope, DataSvc) {

	var vm = this;

	vm.selectColor = selectColor;
	vm.getColorStyle = getColorStyle;
	vm.colors = [
		{
			name: 'redPastel',
			val: 'rgba(255, 105, 97, 1.0)',
			valDark: 'rgba(191, 79, 73, 1.0)'
		},
		{
			name: 'greenPastel',
			val: 'rgba(119, 190, 119, 1.0)',
			valDark: 'rgba(89, 143, 89, 1.0)'
		},
		{
			name: 'bluePastelDark',
			val: 'rgba(119, 158, 203, 1.0)',
			valDark: 'rgba(89, 119, 152, 1.0)'
		},
		{
			name: 'grayPastel',
			val: 'rgba(207, 207, 196, 1.0)',
			valDark: 'rgba(155, 155, 147, 1.0)'
		},
		{
			name: 'white',
			val: 'rgba(255, 255, 255, 1.0)',
			valDark: 'rgba(191, 191, 191, 1.0)'
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

	/**
	 * Get style (background, border, outline) of colors
	 * @param  {Object} color color
	 * @return {Object}       style to be applied at that time
	 */
	function getColorStyle(color) {
		var style = {
			'background-color': color.val,
			'border-color': (color.name === $scope.color.name) ? color.valDark : 'rgba(255, 255, 255, 1.0)'
		};

		// add outline if color is white, so that it shows on the white background
		if (color.name === 'white' && color.name !== $scope.color.name) {
			style['outline'] = '1px solid ' + color.valDark;
			style['outline-offset'] = '-5px';
		}

		return style;
	}
	
}