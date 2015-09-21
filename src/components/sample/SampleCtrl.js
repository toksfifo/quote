angular.module('quote')
	.controller('SampleCtrl', SampleCtrl);

SampleCtrl.resolve = {
	authStatus: function(AuthSvc) {
		return AuthSvc.checkAuth();
	}
}

function SampleCtrl(Const, $firebaseArray, $firebaseObject, AuthSvc, $scope, authStatus, $timeout) {

	var vm = this;
	var currentPackageID;

	vm.createPackage = createPackage;
	vm.addQuote = addQuote;
	vm.savePackage = savePackage;
	vm.quote = {
		/**
		 * body
		 * text
		 * link
		 */
	};
	vm.packageName;
	vm.addPackage = addPackage;
	vm.getQuotes = getQuotes;
	vm.getQuote = getQuote;
	vm.allQuotes;
	
	$scope.packages;

	if (authStatus) {
		console.log('already logged in as: ', authStatus);
		// AuthSvc.logout();
	} else {
		AuthSvc.signupAnon().then(function(authData) {
			console.log('logged in anonymously: ', authData);
		});
	}

	$scope.packages = $firebaseArray(Const.ref.child('packages'));

	$scope.created = $firebaseArray(Const.ref.child('packages').orderByChild('creator').equalTo(authStatus.uid));
	
	$scope.subscribed = [];
	Const.ref.child('users').child(authStatus.uid).child('packages').child('subscribed').on('child_added', function(snapshot){
		Const.ref.child('packages').child(snapshot.key()).on('value', function(snapshot) {
			$timeout(function() {
				// console.log(snapshot.val());
				$scope.subscribed.push(snapshot.val());
			})
			
		})
	} );

	function createPackage() {
		$scope.packages.$add({
			name: 'default',
			creator: authStatus.uid
		}).then(function(ref) {
			currentPackageID = ref.key();
		});
	}

	function addQuote() {
		var quotesOfPackage = $firebaseArray(Const.ref.child('quotes').child(currentPackageID));
		quotesOfPackage.$add({
			body: vm.quote.body,
			author: vm.quote.author,
			link: vm.quote.link
		}).then(function(ref) {
			vm.quote.body = '';
			vm.quote.author = '';
			vm.quote.link = '';
		});
	}

	function savePackage() {
		var package = $firebaseObject(Const.ref.child('packages').child(currentPackageID));
		package.$loaded().then(function() {
			package.name = vm.packageName;
			package.$save().then(function(ref) {
				vm.packageName = '';
			});
		});
	}

	function addPackage(key) {
		Const.ref.child('users')
			.child(authStatus.uid)
			.child('packages')
			.child('subscribed')
			.child(key)
			.set(true);
	}

	function getQuotes() {
		vm.myArray = [];

		var packages = Const.ref.child('users')
			.child(authStatus.uid)
			.child('packages')
			.child('subscribed');

		var bundle = Const.ref.child('users')
			.child(authStatus.uid)
			.child('quotes');

		bundle.set(null);

		packages.once('value', function(snapshot) {
			// console.log('packages:', snapshot.val());
			snapshot.forEach(function(packageKey) {
				// console.log('one package:', packageKey.val());
				Const.ref.child('quotes').child(packageKey.key()).once('value', function(quotes) {
					// console.log('quotes', quotes.val());
					quotes.forEach(function(quote) {
						// vm.myArray.push(quote.val());
						// console.log(quote.val());
						bundle.push({
							packageID: packageKey.key(),
							quoteID: quote.key()
						});
					});
				});
			});
		});

		
		
	}

	function getQuote() {
		var displayQuotes = $firebaseArray(Const.ref.child('users')
			.child(authStatus.uid)
			.child('quotes'));

		displayQuotes.$loaded(function() {
			if (displayQuotes.length === 0) {
				// prompt to resubscribe or reset current
			} else {
				var index = randomNumber(0, displayQuotes.length - 1);
				var display = displayQuotes[index];
				vm.display = $firebaseObject(Const.ref.child('quotes').child(display.packageID).child(display.quoteID));
				displayQuotes.$remove(index);
			}

		});

	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}