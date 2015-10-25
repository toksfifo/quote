angular.module('quote')
	.controller('AccountCtrl', AccountCtrl);

function AccountCtrl($timeout, AuthSvc) {
	var vm = this;
	var currentName;

	vm.updateUsername = updateUsername;
	vm.isUsernameUpdateable = isUsernameUpdateable;
	vm.usernameFeedback = {};
	vm.username;

	init();

	function init() {
		AuthSvc.getUsername().then(function(name) {
			vm.username = name;
			currentName = name;
		}, function(err) {
			console.log('error getting username:', err);
		});
	}

	/**
	 * Update username
	 */
	function updateUsername() {
		AuthSvc.updateUsername(vm.username).then(function(res) {
			if (res === 0) {
				// name already exists. don't update username
				vm.usernameFeedback = {
					text: 'The username "' + vm.username + '" already exists.',
					type: 'warning',
					show: true
				};
				$timeout(function() {
					vm.usernameFeedback.show = false;
				}, 3000);
				vm.username = currentName;
				return;
			}

			vm.usernameFeedback = {
				text: 'Updated',
				type: 'success',
				show: true
			};
			$timeout(function() {
				vm.usernameFeedback.show = false;
			}, 3000);
			currentName = vm.username;
		}, function(err) {
			vm.username = currentName;
			console.log('error updating username:', err);
		});
	}

	/**
	 * Check if username is able to be updated
	 * @return {Boolean} True if username is non-empty and not the same as before
	 */
	function isUsernameUpdateable() {
		return vm.username && (vm.username !== currentName);
	}
	
}