angular.module('quote')
	.directive('hoverClassDctv', hoverClassDctv);

function hoverClassDctv() {

	return {
		restrict: 'A',
		scope: {
			hoverClassDctv: '@'
		},
		link: link
	};

	function link(scope, elem) {
		scope.hoverClassDctv;
		
		elem.on('mouseenter', function() {
			elem.addClass(scope.hoverClassDctv);
		});

		elem.on('mouseleave', function() {
			elem.removeClass(scope.hoverClassDctv);
		});
	}

}