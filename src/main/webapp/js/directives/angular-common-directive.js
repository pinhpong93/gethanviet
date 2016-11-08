/**
 * Define directive init value
 * eg: <input ng-model="user.id" name="id" initial-value="$!{user.id}" />
 *  or <input ng-model="user.id" name="id" initial-value value="$!{user.id}" />
 */
var initialValueModule = angular.module('initialValue', [])
.directive('initialValue', function() {
    return {
        restrict : 'A',
        controller : [ '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {

            var getter, setter, val, tag;
            tag = $element[0].tagName.toLowerCase();

            val = $attrs.initialValue || $element.val();
            if (tag === 'input') {
                if ($element.attr('type') === 'checkbox') {
                    val = $element[0].checked ? true : undefined;
                } else if ($element.attr('type') === 'radio') {
                    val = ($element[0].checked || $element.attr('selected') !== undefined) ? $element.val() : undefined;
                } else if ($element.attr('type') === 'number') {
                    val = isNaN(val) ? '' : parseFloat(val);
                }
            }

            if ($attrs.ngModel) {
                getter = $parse($attrs.ngModel);
                setter = getter.assign;
                setter($scope, val);
            }
        } ]
    };
});

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = initialValueModule;
}

/**
 * Define directive submit form
 * eg: <form ng-form-submit name="formName">
 * $scope.list.edit = function(args, $form) {
 *      // code here
 *      // check form valid and submit
 *      if ($form.$valid) {
 *          $timeout($form.submit, 200)
 *      }
 *  }
 */
var ngFormSubmitModule = angular.module('ngFormSubmit', [])
.directive("ngFormSubmit", function() {
    return {
        require : "form",
        link : function($scope, $el, $attr, $form) {
            $form.submit = function() {
                $el[0].submit();
            };
        }
    };
});

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = ngFormSubmitModule;
}

/**
 * Define directive csrf for authenticate form submit by AJAX
 * eg: <input type="hidden" name="$!{_csrf.parameterName}" ng-model="$!{_csrf.parameterName}" ng-csrf initial-value value="$!{_csrf.token}" />
 */
var ngCsrfModule = angular.module('ngCsrf', [])
.directive("ngCsrf", function() {
    return {
        require : "input",
        restrict : 'A',
        controller : ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
            $http.defaults.headers.post['X-CSRF-TOKEN'] = $attrs.initialValue || $element.val() || $scope._csrf;
        }]
     };
});

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = ngCsrfModule;
}