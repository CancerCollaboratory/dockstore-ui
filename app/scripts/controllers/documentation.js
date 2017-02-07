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
 * @ngdoc function
 * @name dockstore.ui.controller:DocumentationCtrl
 * @description
 * # DocumentationCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('DocumentationCtrl', [
    '$scope',
    '$sce',
    '$location',
    '$anchorScroll',
    'DocumentationService',
    function ($scope, $sce, $location, $anchorScroll, DocumentationService) {

      $scope.docObjs = DocumentationService.getDocumentObjs();

      $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          var url = $location.absUrl().split('#')[1];
          $location.hash(url);
          $anchorScroll();

          var navSelector = '#toc';
          var $myNav = $(navSelector);
          Toc.init($myNav);
          $('body').scrollspy({
            target: navSelector
          });
      });

  }]);

