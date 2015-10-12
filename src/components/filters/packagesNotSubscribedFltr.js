angular.module('quote')
	.filter('packagesNotSubscribedFltr', packagesNotSubscribedFltr);

function packagesNotSubscribedFltr() {

	return filter;

	/**
	 * Don't show packages that a user ownes or is subscribed to, in all packages
	 * @param  {$firebaseArray} packagesAll        All packages
	 * @param  {$firebaseArray} packagesSubscribed packages user is subscribed to
	 * @return {Array}                    filtered array of all packages
	 */
	function filter(packagesAll, packagesSubscribed) {
		// don't show anything if we don't have all the data
		if (!packagesAll || !packagesSubscribed) {
			return [];
		}

		var removeFromPackages = _.map(packagesSubscribed, function(package) {
			return package.$id;
		});

		return _.filter(packagesAll, function(package) {
			return removeFromPackages.indexOf(package.$id) === -1;
		});

	}
}