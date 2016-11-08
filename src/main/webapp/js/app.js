var app = angular.module('app', [])


/*.config(function($httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');
    //$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
})
.factory('myInterceptor', function($q) {
	//alert("sesssion error");
    return {
        'responseError' : function(rejection) {
            //do something on error
        	alert(rejection.status);
            //if (rejection.status == 403 || rejection.status == 401) {
            if (rejection.status == 419 || rejection.status == 440) {
            	alert("sesssion error");
                window.location = "./search";
            }
            return $q.reject(rejection);
        }
    };
});*/

/**
 * Define a $.loadScript() method that allows fetching a cached script
 */
jQuery.loadScript = function(url) {
    var script = $('<script type="text/javascript" src="' + url + '" charset="UTF-8" async="true" />').appendTo('head');
    setTimeout(function(){script.remove();}, 5000);
};


















