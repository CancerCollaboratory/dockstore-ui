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
 * @name dockstore.ui.directive:Navbar
 * @description
 * # Navbar
 */
angular.module('dockstore.ui')
  .directive('navbar', function () {
    return {
      restrict: 'AE',
      controller: 'NavbarCtrl',
      templateUrl: 'templates/navbar.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('userObjChange', function(event, userObj) {
          scope.username = userObj ? userObj.username : '';
        });
      }
    };
  });
