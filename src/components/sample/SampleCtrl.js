angular.module('quote')
	.controller('SampleCtrl', SampleCtrl);

function SampleCtrl(Const, $firebaseArray, $scope) {
	console.log('sample');

	var ref = new Firebase(Const.db);

	ref.on('value', function(snap) {
		console.log(snap.val());
	});

	$scope.messages = $firebaseArray(ref.child('farray'));

	console.log($scope.messages);

	// $scope.messages.$add({
	// 	message: 'hallo',
	// 	name: 'oh, nice'
	// });
}