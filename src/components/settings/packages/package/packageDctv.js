angular.module('quote')
	.directive('packageDctv', packageDctv);

function packageDctv(DataSvc, AuthSvc) {

	/**
	 * Directive for packages.
	 */
	return {
		restrict: 'E',
		replace: true, /* for transition */
		scope: {
			package: '=',
			openForm: '&',
			type: '@'
		},
		templateUrl: 'components/settings/packages/package/package.html',
		link: link
	};

	function link(scope) {

		scope.uid = AuthSvc.getAuthStatus().uid;
		scope.addPackage = addPackage;
		scope.removePackage = removePackage;
		scope.show = {
			options: false
		};
		scope.package;
		scope.openForm;
		scope.type;

		/**
		 * Subscribe to package
		 * @param {String} key push key ($id) of package
		 */
		function addPackage(key) {
			DataSvc.subscribePackage(key).then(function() {
			}, function(err) {
				console.log('error subscribing to package:', err);
			});
		}

		/**
		 * Unsubscribe from package
		 * @param  {String} key push key ($id) of package
		 */
		function removePackage(key) {
			DataSvc.unsubscribePackage(key).then(function() {
			}, function(err) {
				console.log('error unsubscribing to package:', err);
			});
		}

	}

}