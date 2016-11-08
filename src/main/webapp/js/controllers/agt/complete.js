app.controller('RCompleteController',function($scope, $http, $window){

	//hide progressBar
	$("#progressbar").addClass("ng-hide").removeClass("ng-show");
	$("#divcontent").addClass("ng-show").removeClass("ng-hide");
	
	$scope.doSearchAgain= function() {
		$window.location.href = ('./search');
	};
});