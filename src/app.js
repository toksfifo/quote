angular.module('quotes', [
	'templates'
])

// .config()

.run(function() {
	console.log('running');
})

.constant('Const', {
	api: /*gulp-replace-env*/'dev db'/*end*/,
});