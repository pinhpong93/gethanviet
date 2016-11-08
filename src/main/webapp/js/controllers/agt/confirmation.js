app.controller('RConfirmationController',function($scope, $http, $window){	

	//hide progressBar
	$("#progressbar").addClass("ng-hide").removeClass("ng-show");
	$("#divcontent").addClass("ng-show").removeClass("ng-hide");
	
	$scope.doComplete= function() {
		
		//show progressBar
		$("#progressbar").addClass("ng-show").removeClass("ng-hide");
		$("#divcontent").addClass("ng-hide").removeClass("ng-show");
		
		$http({
			method : 'POST',
			url: './docompleteJSON',
			data: $scope.confirmationForm,
		})
		
		.success(function(data,status,headers,config){
			
			
			if(angular.isUndefined(data.errors)){ // session time out
				if($scope.lang == "en"){
					alert("Session timeout");
				} else {
					alert("セッションが切れました。");
				}				
				$window.location.replace('./search');
			} else {
				$window.location.href = ('./complete');
			}
		})
		.error(function(data,status,headers,config){
			
			//hide progressBar
			//$("#progressbar").addClass("ng-hide").removeClass("ng-show");
			//$("#divcontent").addClass("ng-show").removeClass("ng-hide");
			
			alert($scope.MSG024);
			
			var error = "./" + status;
			$window.location.replace(error);
		});
	};
	
	$scope.doSearchAgain= function() {
		$window.location.replace('./search');
	
	};
	$(document).ready(function(){
        //  Focus auto-focus fields
        $('.auto-focus:first').focus();    
	});

});
