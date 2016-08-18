'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:containerFileViewer
 * @description
 * # containerFileViewer
 */
angular.module('dockstore.ui')
  .directive('containerFileViewer', function () {
    return {
      restrict: 'AE',
      controller: 'ContainerFileViewerCtrl',
      scope: {
        type: '@',
        containerObj: '=',
        isEnabled: '='
      },
      templateUrl: 'templates/containerfileviewer.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerObj.path', function(newValue, oldValue) {
          if (newValue) {
            scope.setDocument();
            scope.checkDescriptor();
          }
        });
        scope.$on('refreshFiles', function(event) {
          scope.setDocument();
          scope.refreshDocument();
        });
        scope.$on('checkDescPageType', function(event) {
          scope.checkDescriptor();
        });
        scope.$on('dockerfileTab', function(event){
          console.log('dockerfileTab');
          if(scope.type === 'dockerfile'){
            console.log(scope.type);
            console.log(scope.totalLinesDf);
            scope.getContentHTML('dockerfile');
          }
          
        });
        scope.$watchGroup(
          ['selTagName', 'selDescriptorName'],
          function(newValues, oldValues) {
            scope.refreshDocumentType();
          });
        scope.$watchGroup(
          ['containerObj.id', 'selSecondaryDescriptorName'],
          function(newValues, oldValues) {
            scope.refreshDocument();
          });
      }
    };
  });
