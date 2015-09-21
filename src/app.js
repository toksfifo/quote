'use strict';

angular.module('quote', [
	'templates',
	'ui.router',
	'firebase'
])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('sample', {
			url: '/sample',
			templateUrl: 'components/sample/sample.html',
			controller: 'SampleCtrl as sample',
			resolve: SampleCtrl.resolve
		})

	$urlRouterProvider.otherwise('sample');
})

.run(function() {
	
})

.constant('Const', {
	db: /*gulp-replace-db*/'https://quoteextension.firebaseio.com/dev'/*end*/,
	ref: /*gulp-replace-ref*/new Firebase('https://quoteextension.firebaseio.com/dev')/*end*/
});