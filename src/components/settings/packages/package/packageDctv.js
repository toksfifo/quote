angular.module('quote')
	.directive('packageDctv', packageDctv);

function packageDctv() {

	return {
		restrict: 'E',
		scope: {
			package: '='
		},
		templateUrl: 'components/settings/packages/package/package.html',
		link: link
	};

	function link(scope) {
		// scope.addPackage = addPackage;
		// scope.removePackage = removePackage;
		scope.package;

		
	}

}