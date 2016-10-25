/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
      link: function postLink(scope) {
        scope.$watch('containerObj.path', function(newValue) {
          if (newValue) {
            console.log("changed containerObj path");
            scope.setDocument();
            scope.checkDescriptor();
            scope.checkDockerfile();
          }
        });
        scope.$on('refreshFiles', function() {
          scope.setDocument();
          scope.refreshDocument();
          scope.checkDescriptor();
        });
        scope.$on('checkDescPageType', function() {
          scope.checkDescriptor();
        });
        scope.$on('dockerfileTab', function(){
          scope.checkDockerfile();
        });
        scope.$watchGroup(
          ['selTagName', 'selDescriptorName'],
          function() {
            scope.refreshDocument();
          });
        scope.$watchGroup(
          ['containerObj.id', 'selSecondaryDescriptorName'],
          function() {
            scope.refreshDocument();
          });
      }
    };
  });
