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
	 * Get aster quote to display on new tab.
	 * @return {Promise}     Resolves with quote, or 0 if there are no quotes to display (user is out of quotes, or hasn't subscribed to any packages)
	 */
	function getQuote() {
		return $q(function(resolve, reject) {
			var quoteList = $firebaseArray(Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('quotes'));

			quoteList.$loaded().then(function() {
				if (quoteList.length === 0) {
					resolve(0);
				} else {
					var index = randomNumber(0, quoteList.length - 1);
					var quoteRef = quoteList[index];
					var quote = $firebaseObject(Const.ref.child('quotes')
						.child(quoteRef.packageID)
						.child(quoteRef.quoteID));

					// remove quote from list
					quoteList.$remove(index);

					resolve(quote);
				}
			}, function(err) {
				reject(err);
			});
		});
	}

	/**
	 * Generates list of quotes to select master quote from, based on the packages a user is subscribed to. Only happens every now and then, if the user subscribes to a new package, for example.
	 * @return {Promise}     Resolves after quotes are generated. This is tricky, and note that rn it won't work if there is a package with no quotes.
	 */
	function generateQuoteList() {
		return $q(function(resolve, reject) {
			var subscribed = Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('packages')
				.child('subscribed');

			var quoteList = Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('quotes');

			// 1st, empty quote list
			quoteList.remove(function(err) {
				if (err) {
					reject(err);
					return;
				}

				subscribed.once('value', function(packages) {

					// package counter for knowing when to resolve
					var numPackages = packages.numChildren();
					var counterPackages = 0;

					packages.forEach(function(package) {
						Const.ref.child('quotes')
							.child(package.key())
							.once('value', function(quotes) {

								// quote counter for knowing when to resolve
								var numQuotes = quotes.numChildren();
								var counterQuotes = 0;

								quotes.forEach(function(quote) {
									quoteList.push({
										packageID: package.key(),
										quoteID: quote.key()
									}, function(err) {
										if (err) {
											reject(err);
											return;
										}

										// resolve after adding last quote of last package
										if (counterQuotes === (numQuotes - 1) && counterPackages === (numPackages - 1)) {
											resolve();
										} else if (counterQuotes === (numQuotes - 1)) {
											counterPackages++;
											counterQuotes++;
										} else {
											counterQuotes++;
										}

									});
								});
								
							});
					});
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
	 * Create new package
	 * @param  {String} name   name/title of package
	 * @param  {Array} quotes array of quote objects
	 * @return {Promise}        Resolves when package has been created and quotes are added to db. Note that it won't resolve rn if there are no quotes added to package
	 */
	function createPackage(name, quotes) {
		return $q(function(resolve, reject) {

			// 1st, get the name of the package's owner
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('info/name').once('value', function(username) {

					// now, create the package
					var package = Const.ref.child('packages').push({
						name: name,
						creator: AuthSvc.getAuthStatus().uid,
						creatorName: username.val(),
						length: quotes.length
					}, function(err) {
						if (err) {
							reject(err);
							return;
						}

						// counter to know when to resolve
						var counter = 0;

						// push the quotes on the newly created package
						for (var i = 0; i < quotes.length; i++) {
							Const.ref.child('quotes')
								.child(package.key())
								.push({
									body: quotes[i].body,
									author: quotes[i].author,
									link: quotes[i].link
								}, function(err) {
									if (err) {
										reject(err);
										return;
									}

									// resolve on final push
									(counter === quotes.length - 1) && resolve(package);
									counter++;
								});
						}
					});
				}, function(err) {
					reject(err);
				});
			
		});
	}

	/**
	 * Update package by deleting previous quotes and adding new ones
	 * @param  {String} name   New name of package
	 * @param  {Array} quotes New (all) quotes to add to package
	 * @param  {String} key    Package $id
	 * @return {Promise}        Resolves when package has been updated and quotes are added to db. Note that it won't resolve rn if there are no quotes added to package
	 */
	function updatePackage(name, quotes, key) {
		return $q(function(resolve, reject) {

			// 1st, get the name of the package's owner
			Const.ref.child('users')
				.child(AuthSvc.getAuthStatus().uid)
				.child('info/name').once('value', function(username) {

					// now, update the package
					Const.ref.child('packages')
						.child(key)
						.set({
							name: name,
							creator: AuthSvc.getAuthStatus().uid,
							creatorName: username.val(),
							length: quotes.length
						}, function(err) {
							if (err) {
								reject(err);
								return;
							}

							// counter to know when to resolve
							var counter = 0;

							// empty old package
							Const.ref.child('quotes')
								.child(key)
								.remove(function(err) {
									if (err) {
										reject(err);
										return;
									}

									// push the quotes on the newly created package
									for (var i = 0; i < quotes.length; i++) {
										Const.ref.child('quotes')
											.child(key)
											.push({
												body: quotes[i].body,
												author: quotes[i].author,
												link: quotes[i].link
											}, function(err) {
												if (err) {
													reject(err);
													return;
												}

												// resolve on final push
												(counter === quotes.length - 1) && resolve();
												counter++;
											});
									}
								});
							
						});
				}, function(err) {
					reject(err);
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
			Const.ref.child('packages')
				.child(key)
				.remove(function(err) {
					if (err) {
						reject(err);
						return;
					}
					Const.ref.child('quotes')
						.child(key)
						.remove(function(err) {
							if (err) {
								reject(err);
								return;
							} 
							resolve();
						});
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