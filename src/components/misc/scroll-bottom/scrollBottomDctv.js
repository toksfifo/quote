angular.module('quote')
	.directive('scrollBottomDctv', scrollBottomDctv);

/**
 * Scroll (and transition) to bottom of self when element is added to array
 * e.g. <div scroll-bar-dctv="arrayToWatch"></div>
 */
function scrollBottomDctv($timeout, $interval) {

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
				var offset = elem[0].scrollHeight - elem[0].offsetHeight;

				// timeout to wait in case there's an ng-repeat enter transition on the new element
				$timeout(function() {
					scroll(elem[0], offset, 100);
				}, 250);
			}
		});
	}

	function scroll(elem, to, duration) {
		var timestep = 20;
		var distancestep = (to - elem.scrollTop) / (duration / timestep);

		var move = $interval(function() {
			elem.scrollTop += distancestep;
			if (elem.scrollTop >= to) $interval.cancel(move);
		}, timestep);
	}

}