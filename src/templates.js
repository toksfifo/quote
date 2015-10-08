angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/form/form.html","<div ng-controller=\"FormCtrl as form\">\n\n	<div ng-repeat=\"quote in form.quotesAdded\">{{ quote.body }} -{{ quote.author}}</div>\n	\n	<br>\n\n	<input type=\"text\" placeholder=\"Package Name\" ng-model=\"form.packageName\">\n\n	<br>\n\n	<input type=\"text\" placeholder=\"Quote\" ng-model=\"form.quoteCurrent.body\">\n\n	<br>\n\n	<input type=\"text\" placeholder=\"Author\" ng-model=\"form.quoteCurrent.author\">\n\n	<br>\n\n	<input type=\"text\" placeholder=\"Link\" ng-model=\"form.quoteCurrent.link\">\n\n	<br>\n\n	<button ng-click=\"form.addQuote()\">Add Quote</button>\n\n	<br>\n\n	<button ng-click=\"form.createPackage()\">Save Package</button>\n\n</div>");
$templateCache.put("components/home/home.html","<!-- HomeCtrl as home -->\n\n\n\n\n<div class=\"home-wrapper\" ng-style=\"{ \'background-color\': home.currentColor.val }\">\n	\n\n	\n\n\n		<br>\n		<br>\n\n		<button ng-click=\"home.show.settings = !home.show.settings\">Settings</button>\n		<button ng-click=\"home.show.form = !home.show.form\">Form</button>\n		<button ng-click=\"home.generateQuoteList()\">Generate Quotes</button>\n		<a ng-href=\"{{ home.quote.link }}\">link</a>\n\n		\n	<!-- quote -->\n	<div class=\"quote-wrapper u-centerXY\" ng-if=\"::home.quote.body\">\n		<div class=\"quote\">\n			<p class=\"quote-body\">{{ home.quote.body }}</p>\n			<p class=\"quote-author\">&#8212; {{ home.quote.author | uppercase}}</p>\n		</div>\n	</div>\n\n	<!-- settings -->\n	<div ng-include=\"\'components/settings/settings.html\'\"></div>\n\n	<!-- form -->\n	<div ng-if=\"home.show.form\" \n		ng-include=\"\'components/form/form.html\'\"></div>\n	\n</div>\n\n\n\n\n\n\n\n\n\n");
$templateCache.put("components/settings/settings.html","<div ng-controller=\"SettingsCtrl as settings\" \n	class=\"settings-wrapper u-centerXY\"\n	ng-if=\"home.show.settings\">\n\n	<!-- head -->\n	<div class=\"settings-head\">\n\n		<!-- packages -->\n		<div class=\"settings-tab\" \n			ng-click=\"settings.toggleTab(\'packages\')\"\n			ng-class=\"{ \'is-active\': settings.show.packages }\">\n			<i class=\"settings-tab-icon icon ion-ios-folder\"></i>\n			<span class=\"settings-tab-text\">Packages</span>\n		</div>\n		\n		<!-- colors -->\n		<div class=\"settings-tab\" \n			ng-click=\"settings.toggleTab(\'colors\')\"\n			ng-class=\"{ \'is-active\': settings.show.colors }\">\n			<i class=\"settings-tab-icon icon ion-paintbucket\"></i>\n			<span class=\"settings-tab-text\">Colors</span>\n		</div>\n		\n		<!-- account -->\n		<div class=\"settings-tab\" \n			ng-click=\"settings.toggleTab(\'account\')\"\n			ng-class=\"{ \'is-active\': settings.show.account }\">\n			<i class=\"settings-tab-icon--bigger icon ion-ios-person\"></i>\n			<span class=\"settings-tab-text\">Account</span>\n		</div>\n\n	</div>\n\n	<div class=\"settings-body\">\n\n		<!-- packages -->\n		<div ng-include=\"\'components/settings/packages/packages.html\'\"></div>\n\n		<!-- colors -->\n		<div ng-include=\"\'components/settings/colors/colors.html\'\"></div>\n\n		<!-- account -->\n		<div ng-include=\"\'components/settings/account/account.html\'\"></div>\n\n	</div>\n	\n	\n	\n</div>");
$templateCache.put("components/settings/colors/colors.html","<div ng-controller=\"ColorsCtrl as colors\"\n	ng-show=\"settings.show.colors\">\n	\n\n	<div class=\"color-wrapper u-centerXY\">\n		<div class=\"color u-centerY\" \n			ng-repeat=\"color in ::colors.colors track by $index\" \n			ng-click=\"colors.selectColor(color)\"\n			ng-style=\"colors.getColorStyle(color)\">\n		</div>\n	</div>\n</div>");
$templateCache.put("components/settings/packages/packages.html","<div ng-controller=\"PackagesCtrl as packages\"\n	ng-show=\"settings.show.packages\">\n\n	<!-- head -->\n	<div class=\"packages-head\">\n		\n		<input type=\"text\" class=\"packages-search\">\n\n		<button class=\"button button--success\">Create Package</button>\n\n	</div>\n\n	<!-- titles -->\n	<div class=\"packages-titles\">\n		<div class=\"packages-title\">Subscribed</div>\n		<div class=\"packages-title\">Created</div>\n		<div class=\"packages-title\">Other</div>\n	</div>\n\n	<!-- body -->\n	<div class=\"packages-body\">\n\n		<!-- subscribed -->\n		<div class=\"packages-col\">\n			<package-dctv \n				ng-repeat=\"package in packages.packagesSubscribed\"\n				package=\"package\"\n				type=\"subscribed\">\n		</div>\n\n		<!-- created -->\n		<div class=\"packages-col\">\n			<package-dctv \n				ng-repeat=\"package in packages.packagesOwn\"\n				package=\"package\"\n				type=\"own\">\n		</div>\n\n		<!-- other -->\n		<div class=\"packages-col\">\n			<package-dctv \n				ng-repeat=\"package in packages.packagesAll | packagesAllFltr: packages.packagesOwn: packages.packagesSubscribed\"\n				package=\"package\"\n				type=\"all\">\n		</div>\n\n	</div>\n\n</div>");
$templateCache.put("components/settings/packages/package/package.html","<div class=\"package--{{ type }}\" \n	ng-click=\"show.options = true\" \n	ng-mouseleave=\"show.options = false\">\n	\n	<div class=\"package-pri\">\n		<span class=\"package-name\">{{ package.name }}</span>\n	</div>\n\n	<div class=\"package-sec\">\n		<span class=\"package-author\">by Toks Fifo</span>\n		<span class=\"package-length\">5</span>\n	</div>\n\n	<div class=\"package-options\" ng-show=\"show.options\">\n		<div class=\"package-view--{{ type }}\"></div>\n		<div class=\"package-action--{{ type }}\"></div>\n	</div>\n\n\n\n\n	<!-- <button ng-click=\"removePackage(package.$id)\"\n		ng-if=\"::type === \'subscribed\'\">Remove</button>\n\n	<button ng-click=\"addPackage(package.$id)\"\n		ng-if=\"::type === \'own\' || type === \'all\'\">Add</button> -->\n</div>");}]);