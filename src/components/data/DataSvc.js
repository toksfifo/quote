angular.module('quote')
	.factory('DataSvc', DataSvc);

function DataSvc($q, $firebaseArray, $firebaseObject, Const) {

	var DataSvc = {
		getQuote: getQuote,
		generateQuoteList: generateQuoteList,
		getPackagesAll: getPackagesAll,
		getPackagesOwn: getPackagesOwn,
		getPackagesSubscribed: getPackagesSubscribed,
		subscribePackage: subscribePackage,
		unsubscribePackage: unsubscribePackage,
		createPackage: createPackage
	};

	return DataSvc;

	/**
	 * Get aster quote to display on new tab.
	 * @param  {String} uid user ID
	 * @return {Promise}     Resolves with quote, or 0 if there are no quotes to display (user is out of quotes, or hasn't subscribed to any packages)
	 */
	function getQuote(uid) {
		return $q(function(resolve, reject) {
			var quoteList = $firebaseArray(Const.ref.child('users')
				.child(uid)
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
	 * @param  {String} uid user ID
	 * @return {Promise}     Resolves after quotes are generated. This is tricky, and note that rn it won't work if there is a package with no quotes.
	 */
	function generateQuoteList(uid) {
		return $q(function(resolve, reject) {
			var subscribed = Const.ref.child('users')
				.child(uid)
				.child('packages')
				.child('subscribed');

			var quoteList = Const.ref.child('users')
				.child(uid)
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
	 * @param  {String} uid user ID
	 * @return {$firebaseArray}     packages user owns
	 */
	function getPackagesOwn(uid) {
		return $firebaseArray(Const.ref.child('packages')
			.orderByChild('creator')
			.equalTo(uid));
	}

	/**
	 * Get packages that a user is subscribed to
	 * @param  {String} uid user ID
	 * @return {$firebaseArray}     packages user's subscribed to. Note that we're using (experimental) firebase-util here.
	 */
	function getPackagesSubscribed(uid) {
		return $firebaseArray(new Firebase.util.NormalizedCollection(
			Const.ref.child('users')
				.child(uid)
				.child('packages/subscribed'),
			Const.ref.child('packages')
		).select(
			'packages.name',
			'packages.creator'
		).ref());
	}

	/**
	 * Subscribe to a package
	 * @param  {String} uid user ID
	 * @param  {String} key push key of package
	 * @return {Promise}     Resolves when user subscribes to package
	 */
	function subscribePackage(uid, key) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(uid)
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
	 * @param  {String} uid user ID
	 * @param  {String} key push key of package
	 * @return {Promise}     Resolves when user unsubscribes to package
	 */
	function unsubscribePackage(uid, key) {
		return $q(function(resolve, reject) {
			Const.ref.child('users')
				.child(uid)
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
	 * @param  {String} uid    user ID who creates package
	 * @param  {String} name   name/title of package
	 * @param  {Array} quotes array of quote objects
	 * @return {Promise}        Resolves when package has been created and quotes are added to db. Note that it won't resolve rn if there are no quotes added to package
	 */
	function createPackage(uid, name, quotes) {
		return $q(function(resolve, reject) {
			var package = Const.ref.child('packages').push({
				name: name,
				creator: uid
			}, function(err) {
				if (err) {
					reject(err);
					return;
				}

				// counter to know when to resolve
				var counter = 0;

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
		});
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