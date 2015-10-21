angular.module('quote')
	.controller('FormCtrl', FormCtrl);

function FormCtrl($scope, DataSvc) {

	var vm = this;
	var formKey = DataSvc.formStatus().key;
	var packagesSubscribed = DataSvc.getPackagesSubscribed();

	vm.quotesAdded = [];
	vm.quoteCurrent = {
		body: '',
		author: '',
		link: ''
	};
	vm.addQuote = addQuote;
	vm.editQuote = editQuote;
	vm.updateQuote = updateQuote;
	vm.deleteQuote = deleteQuote;
	vm.cancelEdit = cancelEdit;
	vm.createPackage = createPackage;
	vm.deletePackage = deletePackage;
	vm.updatePackage = updatePackage;
	vm.subscribePackage = subscribePackage;
	vm.unsubscribePackage = unsubscribePackage;
	vm.isPackageSubscribed = isPackageSubscribed;
	vm.packageName = '';
	vm.quoteCurrentIndex = null;
	vm.formState = DataSvc.formStatus().state;
	vm.stateEditing;

	init();

	function init() {
		if (vm.formState === 'edit' || vm.formState === 'view') {
			DataSvc.getPackage(formKey).then(function(package) {
				vm.packageName = package.name;
				return DataSvc.getQuotesFromPackage(formKey);
			}).then(function(quotes) {
				for (var key in quotes) {
					if (quotes.hasOwnProperty(key)) {
						vm.quotesAdded.push(quotes[key]);
					}
				}
			}).catch(function(err) {
				console.log('error getting quotes from package', err);
			});
		}
	}

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
	 * Stage quote for editing
	 * @param  {Object} quote Quote to edit
	 * @param  {Number} index Index of quote in vm.quotesAdded
	 */
	function editQuote(quote, index) {
		vm.quoteCurrentIndex = index;
		vm.stateEditing = true;
		vm.quoteCurrent = {
			body: quote.body,
			author: quote.author,
			link: quote.link
		};
	}

	/**
	 * Replace quote in vm.quotesAdded
	 */
	function updateQuote() {
		vm.quotesAdded.splice(vm.quoteCurrentIndex, 1, {
			body: vm.quoteCurrent.body,
			author: vm.quoteCurrent.author,
			link: vm.quoteCurrent.link
		});

		vm.quoteCurrent = {
			body: '',
			author: '',
			link: ''
		};

		vm.quoteCurrentIndex = null;
		vm.stateEditing = false;
	}

	/**
	 * Remove quote from vm.quotesAdded
	 */
	function deleteQuote() {
		vm.quotesAdded.splice(vm.quoteCurrentIndex, 1);

		vm.quoteCurrent = {
			body: '',
			author: '',
			link: ''
		};

		vm.quoteCurrentIndex = null;
		vm.stateEditing = false;
	}

	/**
	 * Leave editing mode
	 * @return {[type]} [description]
	 */
	function cancelEdit() {
		vm.quoteCurrentIndex = null;
		vm.stateEditing = false;
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
		DataSvc.createPackage(vm.packageName, vm.quotesAdded).then(function() {
			$scope.home.closeForm();
		}, function(err) {
			console.log('error creating package:', err);
		});
	}

	/**
	 * Delete package
	 */
	function deletePackage() {
		DataSvc.deletePackage(formKey).then(function() {
			return DataSvc.generateQuoteList();
		}).then(function() {
			$scope.home.closeForm();
		}).catch(function(err) {
			console.log('error deleting package:', err);
		});
	}

	/**
	 * Update package
	 */
	function updatePackage() {
		DataSvc.updatePackage(vm.packageName, vm.quotesAdded, formKey).then(function() {
			return DataSvc.generateQuoteList();
		}).then(function() {
			$scope.home.closeForm();
		}).catch(function(err) {
			console.log('error updating package:', err);
		});
	}

	/**
	 * Subscribe to package
	 */
	function subscribePackage() {
		DataSvc.subscribePackage(formKey).then(function() {
			return DataSvc.generateQuoteList();
		}).then(function() {
			$scope.home.closeForm();
		}).catch(function(err) {
			console.log('error subscribing to package:', err);
		});
	}

	/**
	 * Unsubscribe from package
	 * @return {[type]} [description]
	 */
	function unsubscribePackage() {
		DataSvc.unsubscribePackage(formKey).then(function() {
			return DataSvc.generateQuoteList();
		}).then(function() {
			$scope.home.closeForm();
		}).catch(function(err) {
			console.log('error unsubscribing to package:', err);
		});
	}

	/**
	 * Check if user is subscribed to current package
	 * @return {Boolean} True if user is subscribed, false otherwise.
	 */
	function isPackageSubscribed() {
		return packagesSubscribed.map(function(package) {
			return package.$id;
		}).indexOf(formKey) > -1;
	}

}