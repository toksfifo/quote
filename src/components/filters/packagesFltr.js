angular.module('quote')
	.filter('packagesFltr', packagesFltr);

function packagesFltr() {

	return filter;

	/**
	 * Filter packagesBase either by excluding packagesToFilterBy from packagesBase, or by only including packagesToFilterBy in packagesBase
	 * @param  {$firebaseArray} packagesBase       packages to filter
	 * @param  {$firebaseArray} packagesToFilterBy packages to filter by, or 'all'
	 * @param  {String} direction          filter mechanism. either 'include' or 'exclude'
	 * @return {Array}                    filtered $firebaseArray as Array
	 */
	function filter(packagesBase, packagesToFilterBy, direction) {
		
		// don't show anything if we don't have all the data
		if (!packagesBase || !packagesToFilterBy) {
			return [];
		}

		// "inlude + all" doesn't filter at all. "exclude + all" filters out all elements
		if (packagesToFilterBy === 'all') {
			if (direction === 'include') return packagesBase;
			else if (direction === 'exclude') return [];
		}

		var packagesToFilterById = packagesToFilterBy.map(function(package) {
			return package.$id;
		});

		return packagesBase.filter(function(package) {
			if (direction === 'include') return packagesToFilterById.indexOf(package.$id) > -1;
			else if (direction === 'exclude') return packagesToFilterById.indexOf(package.$id) === -1;
			else return [];
		});

	}

}