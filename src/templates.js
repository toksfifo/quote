angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/form/form.html","<div ng-controller=\"FormCtrl as form\"\n	class=\"form-wrapper u-centerXY\"\n	ng-if=\"home.show.form\">\n\n	<!-- skipping closing tags on certain buttons purpose to remove default space between inline-block elements -->\n\n	<!-- form options -->\n	<!-- state: create -->\n	<div class=\"form-options\" ng-if=\"::form.formState === \'create\'\">\n		\n		<!-- cancel -->\n		<button class=\"form-options-button2 button\" \n			ng-click=\"home.closeForm()\">Cancel\n		\n		<!-- create package -->\n		<button class=\"form-options-button2 button button--success\" \n			ng-click=\"form.createPackage()\"\n			ng-disabled=\"!(form.packageName && form.quotesAdded.length)\">Create Package\n\n	</div>\n\n	<!-- state: edit -->\n	<div class=\"form-options\" ng-if=\"::form.formState === \'edit\'\">\n		\n		<!-- cancel -->\n		<button class=\"form-options-button3 button\" \n			ng-click=\"home.closeForm()\">Cancel\n		\n		<!-- delete package -->\n		<button class=\"form-options-button3 button button--warning\" \n			ng-click=\"form.deletePackage()\">Delete Package\n		\n		<!-- save changes -->\n		<button class=\"form-options-button3 button button--success\" \n			ng-click=\"form.updatePackage()\"\n			ng-disabled=\"!form.quotesAdded.length\">Save Changes\n	\n	</div>\n\n	<!-- state: view -->\n	<div class=\"form-options\" ng-if=\"::form.formState === \'view\'\">\n		\n		<!-- back -->\n		<button class=\"form-options-button2 button\" \n			ng-click=\"home.closeForm()\">Back\n		\n		<!-- subscribe/unsubscribe -->\n		<button class=\"form-options-button2 button\"\n			ng-class=\"form.isPackageSubscribed() ? \'button--warning\' : \'button--success\'\"\n			ng-click=\"form.isPackageSubscribed() ? form.unsubscribePackage() : form.subscribePackage()\">{{ form.isPackageSubscribed() ? \'Unsubscribe\' : \'Subscribe\' }}\n	\n	</div>\n\n\n	<!-- name -->\n	<div class=\"form-name\">\n		\n		<!-- name input -->\n		<input type=\"text\" \n			class=\"form-name-edit\" \n			placeholder=\"Package Name\"\n			ng-model=\"form.packageName\"\n			ng-if=\"::form.formState !== \'view\'\">\n		\n		<!-- name (view mode) -->\n		<span class=\"form-name-view\"\n			ng-if=\"::form.formState === \'view\'\">{{ form.packageName }}</span>\n\n	</div>\n\n	<!-- quotes -->\n	<div class=\"form-quotes\" ng-class=\"{ \'is-disabled\': form.stateEditing }\"\n		ng-if=\"::form.formState !== \'view\'\">\n		<p class=\"form-quote\" ng-repeat=\"quote in form.quotesAdded\"\n			ng-click=\"form.editQuote(quote, $index)\"\n			ng-class=\"{ \'is-hover\': $index === form.quoteCurrentIndex }\">\n			{{ quote.body }} <span ng-if=\"::quote.author\">&nbsp; &#8212; {{ quote.author }}</span>\n		</p>\n	</div>\n\n	<!-- quotes (view mode) -->\n	<div class=\"form-quotes-view\" ng-if=\"::form.formState === \'view\'\">\n		<p class=\"form-quote-view\" ng-repeat=\"quote in form.quotesAdded\">\n			{{ quote.body }} <span ng-if=\"::quote.author\">&nbsp; &#8212; {{ quote.author }}</span>\n		</p>\n	</div>\n\n\n	<!-- edit quote -->\n	<div class=\"form-edit\" ng-if=\"::form.formState !== \'view\'\">\n\n		<!-- body -->\n		<textarea class=\"form-edit-text\" rows=\"3\" \n			placeholder=\"Text\"\n			ng-model=\"form.quoteCurrent.body\"></textarea>\n\n		<!-- author -->\n		<input type=\"text\" class=\"form-edit-author\"\n			placeholder=\"Author (optional)\"\n			ng-model=\"form.quoteCurrent.author\">\n		\n		<!-- link -->\n		<input type=\"text\" class=\"form-edit-link\"\n			placeholder=\"Link for more info (optional)\"\n			ng-model=\"form.quoteCurrent.link\">\n\n	</div>\n\n	<!-- quote options -->\n	<div class=\"form-editOptions\" ng-if=\"::form.formState !== \'view\'\">\n		<div class=\"form-editOptions-buttons\">\n\n			<!-- cancel -->\n			<button class=\"form-options-button3 button\" \n				ng-click=\"form.cancelEdit()\"\n				ng-disabled=\"!form.stateEditing\">Cancel Edit\n\n			<!-- delete -->\n			<button class=\"form-options-button3 button\" \n				ng-click=\"form.deleteQuote()\"\n				ng-disabled=\"!form.stateEditing\">Delete Quote\n\n			<!-- update/add -->\n			<button class=\"form-options-button3 button\" \n				ng-click=\"form.stateEditing ? form.updateQuote() : form.addQuote()\"\n				ng-disabled=\"!form.quoteCurrent.body\">{{ form.stateEditing ? \'Update Quote\' : \'Add Quote\' }}\n\n		</div>\n	</div>\n\n</div>");
$templateCache.put("components/home/home.html","<!-- HomeCtrl as home -->\n<div class=\"home-wrapper u-bgc-{{ home.currentColor.name }}\">\n	\n	<!-- quote -->\n	<div class=\"quote-wrapper u-centerXY\" \n		ng-if=\"::home.quote.body\" \n		ng-class=\"{ \'is-blurred\': home.show.settings || home.show.form }\">\n		<div class=\"quote\">\n			<p class=\"quote-body\">{{ home.quote.body }}</p>\n			<p class=\"quote-author\" ng-if=\"::home.quote.author\">&#8212; {{ home.quote.author | uppercase}}</p>\n		</div>\n	</div>\n\n	<!-- settings button, link button -->\n	<div class=\"home-options\"\n		ng-class=\"{ \'is-blurred\': home.show.settings || home.show.form }\">\n\n		<i class=\"home-options-settings icon ion-gear-b\"\n			ng-click=\"home.show.settings = true\"></i>\n		\n		<a ng-href=\"{{ home.quote.link }}\"\n			class=\"home-options-link\"\n			ng-class=\"{ \'is-disabled\': !home.quote.link }\">\n			<i class=\"home-options-more icon ion-information-circled\"></i>\n		</a>\n\n	</div>\n\n	<!-- settings, form -->\n	<div ng-if=\"home.isAuthenticated()\">\n		\n		<!-- click to close settings -->\n		<div class=\"settings-close\" \n			ng-show=\"home.show.settings\" \n			ng-click=\"home.show.settings = false\"></div>\n\n		<!-- settings -->\n		<div ng-include=\"\'components/settings/settings.html\'\"></div>\n\n		<!-- form -->\n		<div ng-include=\"\'components/form/form.html\'\"></div>\n		\n	</div>\n		\n</div>\n\n\n\n\n\n\n\n\n\n");
$templateCache.put("components/settings/settings.html","<div ng-controller=\"SettingsCtrl as settings\" \n	class=\"settings-wrapper u-centerXY\"\n	ng-show=\"home.show.settings\">\n\n	<!-- head -->\n	<div class=\"settings-head\">\n\n		<!-- packages -->\n		<div class=\"settings-tab\" \n			ng-click=\"settings.toggleTab(\'packages\')\"\n			ng-class=\"{ \'is-active\': settings.show.packages }\">\n			<i class=\"settings-tab-icon icon ion-ios-folder\"></i>\n			<span class=\"settings-tab-text\">Packages</span>\n		</div>\n		\n		<!-- colors -->\n		<div class=\"settings-tab\" \n			ng-click=\"settings.toggleTab(\'colors\')\"\n			ng-class=\"{ \'is-active\': settings.show.colors }\">\n			<i class=\"settings-tab-icon icon ion-paintbucket\"></i>\n			<span class=\"settings-tab-text\">Colors</span>\n		</div>\n		\n		<!-- account -->\n		<div class=\"settings-tab\" \n			ng-click=\"settings.toggleTab(\'account\')\"\n			ng-class=\"{ \'is-active\': settings.show.account }\">\n			<i class=\"settings-tab-icon--bigger icon ion-ios-person\"></i>\n			<span class=\"settings-tab-text\">Account</span>\n		</div>\n\n	</div>\n\n	<div class=\"settings-body\">\n\n		<!-- packages -->\n		<div ng-include=\"\'components/settings/packages/packages.html\'\"></div>\n\n		<!-- colors -->\n		<div ng-include=\"\'components/settings/colors/colors.html\'\"></div>\n\n		<!-- account -->\n		<div ng-include=\"\'components/settings/account/account.html\'\"></div>\n\n	</div>\n	\n	\n	\n</div>");
$templateCache.put("components/settings/account/account.html","<div ng-controller=\"AccountCtrl as account\"\n	ng-show=\"settings.show.account\">\n	\n	<div class=\"username\">\n		\n		<!-- label -->\n		<span class=\"username-label\">Username</span>\n		\n		<!-- input -->\n		<input type=\"text\" class=\"username-input\"\n			ng-model=\"account.username\">\n\n		<!-- button update -->\n		<button class=\"username-button button button--success\"\n			ng-click=\"account.updateUsername()\"\n			ng-disabled=\"!account.isUsernameUpdateable()\">Update</button>\n\n		<!-- feedback text -->\n		<div class=\"username-feedback\"\n			ng-show=\"account.usernameFeedback.show\"\n			ng-class=\"{ \'is-success\': account.usernameFeedback.type === \'success\', \n			\'is-warning\': account.usernameFeedback.type === \'warning\' }\">{{ account.usernameFeedback.text }}</div>\n\n	</div>\n\n</div>");
$templateCache.put("components/settings/colors/colors.html","<div ng-controller=\"ColorsCtrl as colors\"\n	ng-show=\"settings.show.colors\">\n\n	<div class=\"color-wrapper u-centerXY\">\n		<div class=\"color--{{ color.name }} u-centerY\" \n			ng-repeat=\"color in ::colors.colors track by $index\" \n			ng-click=\"colors.selectColor(color)\"\n			ng-class=\"{ \'is-active\': color.name === colors.currentColor.name }\">\n		</div>\n	</div>\n\n</div>");
$templateCache.put("components/settings/packages/packages.html","<div ng-controller=\"PackagesCtrl as packages\"\n	ng-show=\"settings.show.packages\">\n\n	<!-- head -->\n	<div class=\"packages-head\">\n		\n		<!-- search -->\n		<input type=\"text\" class=\"packages-search packages-head-item\"  \n			ng-model=\"packages.filter.search\"\n			ng-class=\"{ \'is-active\': packages.filter.search }\"\n			placeholder=\"Search Packages\">\n\n		<!-- filter packages -->\n		<button class=\"button packages-head-item u-inlineBlock\" \n			ng-click=\"packages.filter.created = !packages.filter.created\"\n			ng-class=\"{ \'button--active\': packages.filter.created }\">{{ packages.filter.created ? \'Show All\' : \'Show Only Yours\' }}</button>\n\n		<!-- create package -->\n		<button class=\"button button--success packages-head-item u-inlineBlock\"\n			ng-click=\"home.openForm(\'create\', null)\">Create Package</button>\n\n	</div>\n\n	<!-- titles -->\n	<div class=\"packages-titles\">\n		<div class=\"packages-title\">Subscribed</div>\n		<div class=\"packages-title\">Other</div>\n	</div>\n\n	<!-- body -->\n	<div class=\"packages-body\">\n\n		<!-- subscribed -->\n		<div class=\"packages-col\">\n			<!-- show subscribed packages. only show packages owned by user on packages.filter.created -->\n			<package-dctv\n				ng-repeat=\"package in packages.packagesSubscribed | \n				packagesFltr: (packages.filter.created ? packages.packagesOwn : \'all\'): \'include\' |\n				filter: packages.filter.search\n				track by package.$id\"\n				package=\"package\"\n				open-form=\"home.openForm(state, key)\"\n				type=\"subscribed\">\n		</div>\n\n		<!-- other -->\n		<div class=\"packages-col\">\n			<!-- show other packages that user is not subscribed to (by excluding subscribed from all), then filter by owned packages on packages.filter.created -->\n			<package-dctv \n				ng-repeat=\"package in packages.packagesAll |\n				packagesFltr: packages.packagesSubscribed: \'exclude\' |\n				packagesFltr: (packages.filter.created ? packages.packagesOwn : \'all\'): \'include\' |\n				filter: packages.filter.search\n				track by package.$id\"\n				package=\"package\"\n				open-form=\"home.openForm(state, key)\"\n				type=\"all\">\n		</div>\n\n	</div>\n\n</div>");
$templateCache.put("components/settings/packages/package/package.html","<div class=\"package--{{ type }} u-centerX\" \n	ng-click=\"show.options = true\" \n	ng-mouseleave=\"show.options = false\">\n	\n	<!-- primary -->\n	<div class=\"package-pri\">\n		<span class=\"package-name\">{{ package.name }}</span>\n	</div>\n\n	<!-- secondary -->\n	<div class=\"package-sec\">\n		<span class=\"package-author\">by {{ package.creatorName || \'Toks Fifo\' }}</span>\n		<span class=\"package-length\">{{ package.length || 5 }}</span>\n	</div>\n\n	<!-- options -->\n	<div class=\"package-options\" ng-show=\"show.options\">\n		\n		<!-- view option -->\n		<div class=\"package-view\"\n			ng-click=\"package.creator === uid ? openForm({ state: \'edit\', key: package.$id }) : openForm({ state: \'view\', key: package.$id })\">\n			\n			<!-- view -->\n			<i class=\"icon ion-eye package-button--view\"\n				ng-if=\"::package.creator !== uid\"></i>\n\n			<!-- edit -->\n			<i class=\"icon ion-edit package-button--view\"\n				ng-if=\"::package.creator === uid\"></i>\n		\n		</div>\n\n		<!-- action option -->\n		<div class=\"package-action--{{ type }}\"\n			ng-click=\"(type === \'all\' && addPackage(package.$id)) || (type === \'subscribed\' && removePackage(package.$id))\">\n\n			<!-- add -->\n			<i class=\"icon ion-plus package-button\" \n				ng-if=\"::type === \'all\'\"></i>\n\n			<!-- remove -->\n			<i class=\"icon ion-close package-button\"\n				ng-if=\"::type === \'subscribed\'\"></i>\n\n		</div>\n\n	</div>\n\n</div>");}]);