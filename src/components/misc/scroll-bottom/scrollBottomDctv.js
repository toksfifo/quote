angular.module('quote')
	.directive('scrollBottomDctv', scrollBottomDctv);

/**
 * Scroll to bottom of self when element is added to array
 * e.g. <div scroll-bar-dctv="arrayToWatch"></div>
 */
function scrollBottomDctv() {

	return {
		restrict: 'A',
		scope: {
			scrollBottomDctv: '='
		},
		link: link
	};

	function link(scope, elem) {
		scope.scrollBottomDctv;

		scope.$watch(function() {
			return scope.scrollBottomDctv.length;
		}, function(newVal, oldVal) {
			if (oldVal && (newVal > oldVal)) {
				elem[0].scrollTop = elem[0].scrollHeight;
			}
		});
	}

}