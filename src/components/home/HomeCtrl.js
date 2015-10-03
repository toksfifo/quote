angular.module('quote')
	.controller('HomeCtrl', HomeCtrl);

HomeCtrl.resolve = /*@ngInject*/ {
	authStatus: function(AuthSvc) {
		return AuthSvc.checkAuth();
	}
};

function HomeCtrl($scope, $q, authStatus, DataSvc, AuthSvc) {

	var vm = this;

	vm.showSettings = false;
	vm.showForm = false;
	vm.generateQuoteList = generateQuoteList;
	vm.quote = {};
	vm.color = 'rgba(255, 255, 255, 1.0)';

	init();

	function init() {
		getAuth().then(function(authStatus) {
			$scope.authStatus = authStatus;
			getQuote();
			return DataSvc.getColor($scope.authStatus.uid);
		}, function(err) {
			console.log('error getting auth:', err);
		}).then(function(color) {
			vm.color = color;
		}, function(err) {
			console.log('error getting color', err);
		});
	}

	/**
	 * Get main quote to display on new tab
	 */
	function getQuote() {
		DataSvc.getQuote($scope.authStatus.uid).then(function(quote) {
			if (quote === 0) {
				
				// prompt to resubscribe or reset current
				vm.quote.body = 'out of quotes';
			} else {
				vm.quote = quote;
			}
		}, function(err) {
			console.log('couldn\'t get quote:', err);
		});
	}

	/**
	 * Get auth data if it exists, or signup anonymously
	 * @return {Promise} Resolves with auth data
	 */
	function getAuth() {
		return $q(function(resolve, reject) {
			if (authStatus) {
				resolve(authStatus);
			} else {
				AuthSvc.signupAnon().then(function(authData) {
					resolve(authData);
				}, function(err) {
					reject(err);
				});
			}
		});
	}

	/**
	 * Generate list of quotes to pull main quote from
	 */
	function generateQuoteList() {
		DataSvc.generateQuoteList($scope.authStatus.uid).then(function() {
		}, function(err) {
			console.log('error generating quote list:', err);
		});
	}

}