'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:containersGridHome
 * @description
 * # containersGridHome
 */
angular.module('dockstore.ui')
  .directive('containersGridHome', function () {
    return {
      restrict: 'AE',
      controller: 'ContainersGridCtrl',
      scope: {
        containers: '='
      },
      templateUrl: 'templates/containersgridhome.html',
      link: function postLink(scope, element, attrs) {
        scope.$watchCollection('filteredContainers',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.refreshPagination();
            }
        });
        scope.$watch('numContsPage',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.refreshPagination();
            }
        });
      }
    };
  });
