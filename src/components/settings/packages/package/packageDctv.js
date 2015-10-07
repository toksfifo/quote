angular.module('quote')
	.directive('packageDctv', packageDctv);

function packageDctv(DataSvc, AuthSvc) {

	return {
		restrict: 'E',
		scope: {
			package: '=',
			type: '@'
		},
		templateUrl: 'components/settings/packages/package/package.html',
		link: link
	};

	function link(scope) {

		scope.addPackage = addPackage;
		scope.removePackage = removePackage;
		scope.package;
		scope.type;

		/**
		 * Subscribe to package
		 * @param {String} key push key ($id) of package
		 */
		function addPackage(key) {
			DataSvc.subscribePackage(AuthSvc.getAuthStatus().uid, key).then(function() {
			}, function(err) {
				console.log('error subscribing to package:', err);
			});
		}

		/**
		 * Unsubscribe from package
		 * @param  {String} key push key ($id) of package
		 */
		function removePackage(key) {
			DataSvc.unsubscribePackage(AuthSvc.getAuthStatus().uid, key).then(function() {
			}, function(err) {
				console.log('error unsubscribing to package:', err);
			});
		}

	}

}