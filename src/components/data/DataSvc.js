angular.module('quote')
	.factory('DataSvc', DataSvc);

function DataSvc($q, $firebaseArray, $firebaseObject, Const, AuthSvc) {

	var colorOptions = [
		{ name: 'red-pastel' },
		{ name: 'green-pastel' },
		{ name: 'blue-pastel' },
		{ name: 'gray-pastel' },
		{ name: 'white' }
	];
	var currentFormStatus = {};

	var DataSvc = {
		getQuote: getQuote,
		generateQuoteList: generateQuoteList,
		getPackagesAll: getPackagesAll,
		getPackagesOwn: getPackagesOwn,
		getPackagesSubscribed: getPackagesSubscribed,
		getPackage: getPackage,
		getQuotesFromPackage: getQuotesFromPackage,
		subscribePackage: subscribePackage,
		unsubscribePackage: unsubscribePackage,
		createPackage: createPackage,
		updatePackage: updatePackage,
		deletePackage: deletePackage,
		getColorOptions: getColorOptions,
		getColor: getColor,
		setColor: setColor,
		formStatus: formStatus
	};

	return DataSvc;

	/**
	 * Get master quote to display on new tab.
	 * @return {Promise}     Resolves with quote, or 0 if there are no quotes to display (user is out of quotes, or hasn't subscribed to any packages)
	 */
	function getQuote() {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('quotes')
				.once('value', function(quotesRef) {
					var quotes = quotesRef.val();
					if (!quotes) {
						resolve(0);
						return;
					}
					var quoteKeys = Object.keys(quotes);
					var index = randomNumber(0, quoteKeys.length - 1);
					var quote = quotes[quoteKeys[index]];
					resolve(quote);
				}, function(err) {
					reject(err);
				});
		});
	}

	/**
	 * Generates list of quotes to select master quote from, based on the packages a user is subscribed to. Only happens every now and then, if the user subscribes to a new package, for example.
	 * @return {Promise}     Resolves after quotes are generated.
	 */
	function generateQuoteList() {
		return $q(function(resolve, reject) {

			var dataGenerateQuotes = {};

			// completely replace data at this location (like a set)
			var setPathQuotes = 'users/' + AuthSvc.getAuthStatus().uid + '/quotes';
			dataGenerateQuotes[setPathQuotes] = {};

			// join subscribed packages with quotes
			new Firebase.util.NormalizedCollection(
				Const.ref.child('users')
					.child(AuthSvc.getAuthStatus().uid)
					.child('packages')
					.child('subscribed'),
				Const.ref.child('quotes')
			).select(
				{ 'key': 'quotes.$value', 'alias': 'quotes' }
			).ref().once('value', function(packagesRef) {
				
				var packages = packagesRef.val();

				for (var i = 0, packageKeys = Object.keys(packages); i < packageKeys.length; i++) {
					var packageKey = packageKeys[i];
					var quotes = packages[packageKey].quotes;

					// "unsubscribe" user from packages that are deleted (or have 0 quotes)
					if (!quotes) {
						dataGenerateQuotes['users/' + AuthSvc.getAuthStatus().uid + '/packages/subscribed/' + packageKey] = null;
					}

					for (var j = 0, quoteKeys = Object.keys(quotes); j < quoteKeys.length; j++) {
						var quoteKey = quoteKeys[j];
						var quote = quotes[quoteKey];
						var pushQuoteKey = Const.ref.child('users')
							.child(AuthSvc.getAuthStatus().uid)
							.child('quotes').push().key();

						// save actual quote data, not reference to quote
						dataGenerateQuotes[setPathQuotes][pushQuoteKey] = {
							author: quote.author,
							body: quote.body,
							link: quote.link
						};
					}
				}

				// multi-location update
				Const.ref.update(dataGenerateQuotes, function(err) {
					err ? reject(err) : resolve();
				});

			});

		});
	}

	/**
	 * Get all packages in the db
	 * @return {$firebaseArray} all packages
	 */
	function getPackagesAll() {
		return $firebaseArray(Const.ref.child('packages'));
	}

	/**
	 * Get packages that a user created
	 * @return {$firebaseArray}     packages user owns
	 */
	function getPackagesOwn() {
		return $firebaseArray(Const.ref.child('packages')
			.orderByChild('creator')
			.equalTo(AuthSvc.getAuthStatus().uid));
	}

	/**
	 * Get packages that a user is subscribed to
	 * @return {$firebaseArray}     packages user's subscribed to. Note that we're using (experimental) firebase-util here.
	 */
	function getPackagesSubscribed() {
		return $firebaseArray(new Firebase.util.NormalizedCollection(
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('packages/subscribed'),
			Const.ref.child('packages')
		).select(
			'packages.name',
			'packages.creator',
			'packages.creatorName',
			'packages.length'
		).ref());
	}

	/**
	 * Get package from key/id
	 * @param  {String} key $id of package
	 * @return {Promise}     Resolves with package object
	 */
	function getPackage(key) {
		return $q(function(resolve, reject) {
			Const.ref.child('packages')
				.child(key)
				.once('value', function(package) {
					resolve(package.val());
				}, function(err) {
					reject(err);
				});
		});
	}

	/**
	 * Get quotes of package
	 * @param  {String} key $id of package
	 * @return {Promise}     Resolves with quotes object - keys: $id of quotes, vals: quote Objects
	 */
	function getQuotesFromPackage(key) {
		return $q(function(resolve, reject) {
			Const.ref.child('quotes')
				.child(key)
				.once('value', function(quotes) {
					resolve(quotes.val());
				}, function(err) {
					reject(err);
				});
		});
	}

	/**
	 * Subscribe to a package
	 * @param  {String} key push key of package
	 * @return {Promise}     Resolves when user subscribes to package
	 */
	function subscribePackage(key) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('packages')
				.child('subscribed')
				.child(key)
				.set(true, function(err) {
					err ? reject(err) : resolve();
				});
		});
	}

	/**
	 * Unsubscribe from a package
	 * @param  {String} key push key of package
	 * @return {Promise}     Resolves when user unsubscribes to package
	 */
	function unsubscribePackage(key) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('packages')
				.child('subscribed')
				.child(key)
				.remove(function(err) {
					err ? reject(err) : resolve();
				});
		});
	}

	/**
	 * Create new package in /packages and /quotes
	 * @param  {String} name   name/title of package
	 * @param  {Array} quotes array of quote objects
	 * @return {Promise}        Resolves when package has been created and quotes are added to db.
	 */
	function createPackage(name, quotes) {
		return $q(function(resolve, reject) {

			// 1st, get the name of the package's owner
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('info/name').once('value', function(username) {

					var packageKey = Const.ref.child('packages').push().key();
					
					var dataCreatePackage = {};

					// create package
					dataCreatePackage['packages/' + packageKey] = {
						name: name,
						creator: AuthSvc.getAuthStatus().uid,
						creatorName: username.val(),
						length: quotes.length
					};

					// push each quote
					for (var i = 0; i < quotes.length; i++) {
						var quoteKey = Const.ref.child('quotes')
							.child(packageKey).push().key();
						
						dataCreatePackage['quotes/' + packageKey + '/' + quoteKey] = {
							body: quotes[i].body,
							author: quotes[i].author,
							link: quotes[i].link
						};
					}

					// multi-location update
					Const.ref.update(dataCreatePackage, function(err) {
						err ? reject(err) : resolve();
					});

				});
			
		});
	}

	/**
	 * Update package by deleting previous quotes and adding new ones
	 * @param  {String} name   New name of package
	 * @param  {Array} quotes New (all) quotes to add to package
	 * @param  {String} key    Package $id
	 * @return {Promise}        Resolves when package has been updated and quotes are added to db.
	 */
	function updatePackage(name, quotes, key) {
		return $q(function(resolve, reject) {

			// 1st, get the name of the package's owner
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('info/name').once('value', function(username) {

					var dataUpdatePackage = {};

					// completely replace data at this location (like a set)
					var setPathPackages = 'quotes/' + key;
					dataUpdatePackage[setPathPackages] = {};

					// update package
					dataUpdatePackage['packages/' + key] = {
						name: name,
						creator: AuthSvc.getAuthStatus().uid,
						creatorName: username.val(),
						length: quotes.length
					};

					// push each quote
					for (var i = 0; i < quotes.length; i++) {
						var quoteKey = Const.ref.child('quotes')
							.child(key).push().key();

						dataUpdatePackage[setPathPackages][quoteKey] = {
							body: quotes[i].body,
							author: quotes[i].author,
							link: quotes[i].link
						};
					}

					// multi-location update
					Const.ref.update(dataUpdatePackage, function(err) {
						err ? reject(err) : resolve();
					});

				});
			
		});
	}

	/**
	 * Delete package. remove from /quotes and /packages
	 * @param  {String} key Package $id
	 * @return {Promise}     Resolves when package is deleted from both /quotes and /packages
	 */
	function deletePackage(key) {
		return $q(function(resolve, reject) {
			var dataRemovePackages = {};
			dataRemovePackages['packages/' + key] = null;
			dataRemovePackages['quotes/' + key] = null;
			
			// multi-location update
			Const.ref.update(dataRemovePackages, function(err) {
				err ? reject(err) : resolve();
			});
		});
	}

	/**
	 * Get background color options
	 * @return {Array} Array of color objects
	 */
	function getColorOptions() {
		return colorOptions;
	}

	/**
	 * Get user's background color
	 * @return {$firebaseObject}     color with properties 'name' and 'val'
	 */
	function getColor() {
		return $firebaseObject(Const.ref.child('users')
			.child(AuthSvc.getAuthStatus().uid)
			.child('color'));
	}

	/**
	 * Set new background color
	 * @param {Object} color new color with properties 'name' and 'val'
	 */
	function setColor(color) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('color')
				.set({
					name: color.name
				}, function(err) {
					err ? reject(err) : resolve();
				});
		});
	}

	/**
	 * Get or set form status (state and key/$id)
	 * @param  {String} state One of 'create', 'view', 'edit'
	 * @param  {String} key   $id of package to create, view, or edit
	 * @return {Object}       Only return if getting. 'state' and 'key' keys
	 */
	function formStatus(state, key) {
		if (state) {
			currentFormStatus.state = state;
			currentFormStatus.key = key;
		} else {
			return currentFormStatus;
		}
	}

	/**
	 * Generate random number from [min, max]
	 * @param  {Number} min min, inclusive
	 * @param  {Number} max max, inclusive
	 * @return {Number}     random number
	 */
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}