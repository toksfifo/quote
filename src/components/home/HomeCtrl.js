angular.module('quote')
	.controller('HomeCtrl', HomeCtrl);

HomeCtrl.resolve = /*@ngInject*/ {
	authStatus: function(AuthSvc) {
		return AuthSvc.checkAuth();
	}
};

function HomeCtrl($q, authStatus, DataSvc, AuthSvc) {

	var vm = this;

	vm.show = {
		settings: true,
		form: false
	};
	vm.generateQuoteList = generateQuoteList;
	vm.quote = {};
	vm.currentColor;

	init();

	function init() {
		getAuth().then(function(authStatus) {
			AuthSvc.setAuthStatus(authStatus);
			getQuote();
			vm.currentColor = DataSvc.getColor();
		}, function(err) {
			console.log('error getting auth:', err);
		});
	}

	/**
	 * Get main quote to display on new tab
	 */
	function getQuote() {
		DataSvc.getQuote().then(function(quote) {
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
		DataSvc.generateQuoteList().then(function() {
		}, function(err) {
			console.log('error generating quote list:', err);
		});
	}

}