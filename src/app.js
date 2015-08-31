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
			controller: 'SampleCtrl as sample'
		})

	$urlRouterProvider.otherwise('sample');
})

.run(function() {
	console.log('running');
})

.constant('Const', {
	db: /*gulp-replace-env*/'https://quoteextension.firebaseio.com/dev'/*end*/,
});