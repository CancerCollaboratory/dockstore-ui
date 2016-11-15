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
 * @ngdoc service
 * @name dockstore.ui.UtilityService
 * @description
 * # UtilityService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('UtilityService', [
    function () {

      this.getTimeAgo = function(timestamp, timeConversion) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / timeConversion);
      };

      this.getTimeAgoString = function(timestamp) {
        var msToDays = 1000 * 60 * 60 * 24;
        var msToHours = 1000 * 60 * 60;
        var msToMins = 1000 * 60;

        var timeAgo = this.getTimeAgo(timestamp, msToDays);
        if (timeAgo < 1){
          timeAgo = this.getTimeAgo(timestamp, msToHours);
          if (timeAgo < 1) {
            timeAgo = this.getTimeAgo(timestamp, msToMins);
            if (timeAgo === 0) {
              return '<1 minute ago';
            } else {
              return timeAgo.toString() +
                    ((timeAgo === 1) ? ' minute ago' : ' minutes ago');
            }
          } else {
            return timeAgo.toString() +
                  ((timeAgo === 1) ? ' hour ago' : ' hours ago');
          }
        } else {
          return timeAgo.toString() +
                ((timeAgo === 1) ? ' day ago' : ' days ago');
        }
      };
  }]);
