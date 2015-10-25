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
		settings: false,
		form: false
	};
	vm.openForm = openForm;
	vm.closeForm = closeForm;
	vm.isAuthenticated = isAuthenticated;
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
				vm.quote.body = 'Subscribe to a few packages to get started. Then open a new tab!';
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
	 * Show form and hide settings
	 * @param  {String} state One of 'create', 'view', or 'edit'
	 * @param  {String} key   $id of current package, or null if creating
	 */
	function openForm(state, key) {
		DataSvc.formStatus(state, key);
		vm.show.settings = false;
		vm.show.form = true;
	}

	/**
	 * Hide form and show settings
	 * @return {[type]} [description]
	 */
	function closeForm() {
		vm.show.settings = true;
		vm.show.form = false;
	}

	/**
	 * Check if user is authenticated
	 * @return {Boolean} True if authenticated, false otherwise
	 */
	function isAuthenticated() {
		return AuthSvc.getAuthStatus();
	}

}