app.controller('SearchController', function($scope, $http, $timeout, $window) {
	
	$scope.doSearch= function() {
		var postObject = new Object();
			
		postObject.searchInput = $.trim($('#searchInput').val());
		postObject.searchInput2 = "";
		
			$http({
				method : 'POST',
				url : './searchResult',
				data : postObject
			})
			.success(function(data, status, headers, config) {
				$window.location.href = './result';	
			})
			.error(function(data, status, headers, config) {
				var error = "./" + status;
				$window.location.replace(error);
				
			});
		
	}
	
});


