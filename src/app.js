'use strict';

angular.module('quote', [
	'templates',
	'ui.router',
	'firebase'
])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'components/home/home.html',
			controller: 'HomeCtrl as home',
			resolve: HomeCtrl.resolve
		})

	$urlRouterProvider.otherwise('/home');
})

.run(function() {
	
})

.constant('Const', {
	db: /*gulp-replace-db*/'https://quoteextension.firebaseio.com/dev'/*end*/,
	ref: /*gulp-replace-ref*/new Firebase('https://quoteextension.firebaseio.com/dev')/*end*/
});