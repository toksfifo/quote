angular.module('quote')
	.controller('FormCtrl', FormCtrl);

function FormCtrl($scope, DataSvc) {

	var vm = this;

	vm.quotesAdded = [];
	vm.quoteCurrent = {
		body: '',
		author: '',
		link: ''
	};
	vm.addQuote = addQuote;
	vm.createPackage = createPackage;
	vm.packageName = '';

	/**
	 * Add quote to current package
	 */
	function addQuote() {
		vm.quotesAdded.push({
			body: vm.quoteCurrent.body,
			author: vm.quoteCurrent.author,
			link: vm.quoteCurrent.link
		});
		vm.quoteCurrent = {
			body: '',
			author: '',
			link: ''
		};
	}

	/**
	 * Create package on db
	 */
	function createPackage() {
		DataSvc.createPackage($scope.authStatus.uid, vm.packageName, vm.quotesAdded).then(function(package) {
			vm.packageName = '';
		}, function(err) {
			console.log('error creating package:', err);
		});
	}

}