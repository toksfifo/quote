angular.module('quote')
	.filter('packagesAllFltr', packagesAllFltr);

function packagesAllFltr() {

	return filter;

	/**
	 * Don't show packages that a user ownes or is subscribed to, in all packages
	 * @param  {$firebaseArray} packagesAll        All packages
	 * @param  {$firebaseArray} packagesOwn        packages user owns
	 * @param  {$firebaseArray} packagesSubscribed packages user is subscribed to
	 * @return {Array}                    filtered array of all packages
	 */
	function filter(packagesAll, packagesOwn, packagesSubscribed) {
		var removeFromPackages = [];

		// don't show anything if we don't have all the data
		if (!packagesAll || !packagesOwn || !packagesSubscribed) {
			return [];
		}
		
		for (var i = 0; i < packagesOwn.length; i++) {
			removeFromPackages.push(packagesOwn[i].$id);
		}
		for (var j = 0; j < packagesSubscribed.length; j++) {
			removeFromPackages.push(packagesSubscribed[j].$id);
		}

		return _.filter(packagesAll, function(package) {
			return removeFromPackages.indexOf(package.$id) === -1;
		});

	}
}