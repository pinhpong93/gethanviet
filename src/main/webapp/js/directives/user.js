var userApp = angular.module('app');
userApp.directive('integer', function() {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            ctrl.$validators.integer = function(modelValue) {
                var INTEGER_REGEXP = /^\-?\d+$/;
                if (ctrl.$isEmpty(modelValue) || INTEGER_REGEXP.test(modelValue)) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
});
userApp.directive('overwriteEmail', function() {
    return {
        require : 'ngModel',
        restrict : '',
        link : function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has
            // added the email validator
            if (ctrl && ctrl.$validators.email) {
                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function(modelValue) {
                    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@luvina\.net$/i;
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});