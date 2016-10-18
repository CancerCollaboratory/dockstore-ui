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
 * @name dockstore.ui.controller:WorkflowDagView
 * @description
 * # WorkflowDagViewCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowDagViewCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {
      $scope.dagJson = null;
      $scope.cy = null;
      $scope.successContent = [];
      $scope.missingTool = false;
      $scope.notFound = false;
      $scope.showPopover = false;

      $scope.dynamicPopover = {
          link: '',
          title: '',
          type: '',
          docker: '',
          run: ''
        };

      $scope.getWorkflowVersions = function() {
        var sortedVersionObjs = $scope.workflowObj.workflowVersions;
        sortedVersionObjs.sort(function(a, b) {
          if (a.name === 'master') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var versions = [];
        for (var i = 0; i < sortedVersionObjs.length; i++) {
          if (!sortedVersionObjs[i].hidden) {
            versions.push(sortedVersionObjs[i].name);
          }
        }
        return versions;
      };

      $scope.nodesAndEdges = function(workflowId, workflowVersions) {
        var workflowVersionId;
        if (workflowVersions.length === 0) {
          return null;
        }

        for (var i = 0; i < workflowVersions.length; i++) {
          if (workflowVersions[i].name === $scope.selVersionName) {
            if (workflowVersions[i].valid) {
              workflowVersionId = workflowVersions[i].id;
              break;
            } else {
              return null;
            }
          }
        }

        return WorkflowService.getWorkflowDag(workflowId, workflowVersionId)
          .then(
            function(dagJson) {
              $scope.dagJson = dagJson;
              return dagJson;
            },
            function(response) {
              return $q.reject(response);
            });

      };

      $scope.checkVersion = function() {
        $scope.successContent = [];
        for(var i=0;i<$scope.workflowObj.workflowVersions.length;i++){
          if($scope.workflowObj.workflowVersions[i].valid){
            $scope.successContent.push($scope.workflowObj.workflowVersions[i].name);
          }
        }
      };

      $scope.filterVersion = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i] === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.setDocument = function() {
        var isVersionValid = false;
        $scope.workflowVersions = $scope.getWorkflowVersions();
        if ($scope.workflowObj.defaultVersion === null) {
          $scope.selVersionName = $scope.successContent[0];
        } else {
          for (var counter = 0; counter < $scope.successContent.length; counter++) {
            if ($scope.successContent[counter] === $scope.workflowObj.defaultVersion) {
              $scope.selVersionName = $scope.successContent[counter];
              isVersionValid = true;
              break;
            }
          }
          if (!isVersionValid) {
             $scope.selVersionName = $scope.successContent[0];
          }
        }

      };

      $scope.checkLink = function() {
        return $scope.dynamicPopover.link !== undefined;
      };

      $scope.checkDocker = function() {
        return $scope.dynamicPopover.docker !== undefined;
      };

      $scope.checkRun = function() {
        return $scope.dynamicPopover.run !== undefined;
      };

      $scope.clearPopover = function() {
        $scope.dynamicPopover = {
          link: '',
          title: '',
          type: '',
          docker: '',
          run: ''
        };
      };

      $scope.expandDAG = function() {
        // Activated on fullscreen
        $("#dag-holder").toggleClass('fullscreen');
        $("#dag-col").toggleClass('fullscreen-element');
        $("#dag-version-bar").toggleClass('fullscreen-dropdown');
        $("#cy").toggleClass('fullscreen-element');
        $("#cy").toggleClass('large-dag');
        $("#resize-full-button").toggleClass('no-display');

        // Activated on normal screen
        $("#cy").toggleClass('mini-dag');
        $("#resize-small-button").toggleClass('no-display');
        $scope.refreshDocument();
      };

      $scope.refreshDocument = function() {
      $scope.showPopover = false;
        $scope.dagJson = $scope.nodesAndEdges($scope.workflowObj.id, $scope.workflowObj.workflowVersions);
        //$scope.dagJson is a promise returned by the web service from nodesAndEdges function
        if ($scope.dagJson !== null){
          $scope.dagJson.then(
          function(s){
            if(s.nodes.length === 0 && s.edges.length === 0){
              //DAG has no nodes and edges even though file is valid
              //some inputs needed from file are missing from Github repo
              $scope.missingTool = true;
            }else{
              //DAG has nodes and edges
              $scope.missingTool = false;
            }
            $scope.notFound = false;
          },
          function(e){
            console.log("dagJSON error");
            $scope.notFound = true;
            $scope.missingTool = false;
          }
        );
          $scope.cy = window.cy = cytoscape({
        	  container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,

        		layout: {
        		  name: 'dagre'
        		},

        		style: [
        			{
        				selector: 'node',
        				style: {
        					'content': 'data(name)',
                  'font-size': '16px',
        					'text-valign': 'center',
        					'text-halign': 'center',
        					'background-opacity': '10',
        					'background-color' : '#7a88a9'
        				}
        			},

        			{
        				selector: 'edge',
        				style: {
        					'width': 3,
        					'target-arrow-shape': 'triangle',
        					'line-color': '#9dbaea',
        					'target-arrow-color': '#9dbaea',
                  'curve-style': 'bezier'
        				}
        			},

              {
        				selector: 'node[id = "UniqueBeginKey"]',
        				style: {
        					'content': 'Start',
                  'font-size': '16px',
        					'text-valign': 'center',
        					'text-halign': 'center',
        					'background-opacity': '10',
        					'background-color': '#4caf50'
        				}
        			},

              {
        				selector: 'node[id = "UniqueEndKey"]',
        				style: {
        					'content': 'End',
                  'font-size': '16px',
        					'text-valign': 'center',
        					'text-halign': 'center',
        					'background-opacity': '10',
        					'background-color': '#f44336'
        				}
        			},

              {
        				selector: 'node[type = "workflow"]',
        				style: {
        					'content': 'data(name)',
                  'font-size': '16px',
        					'text-valign': 'center',
        					'text-halign': 'center',
        					'background-opacity': '10',
        					'background-color': '#4ab4a9'
        				}
        			},

              {
        				selector: 'node[type = "tool"]',
        				style: {
        					'content': 'data(name)',
                  'font-size': '16px',
        					'text-valign': 'center',
        					'text-halign': 'center',
        					'background-opacity': '10',
        					'background-color': '#51aad8'
        				}
        			},

              {
        				selector: 'node[type = "expressionTool"]',
        				style: {
        					'content': 'data(name)',
                  'font-size': '16px',
        					'text-valign': 'center',
        					'text-halign': 'center',
        					'background-opacity': '10',
        					'background-color': '#9966FF'
        				}
        			},

        			{
        			  selector: 'edge.outgoer-highlighted',
        			  style: {
        			    'line-color': '#e57373',
        			    'target-arrow-color': '#e57373',
        			    'width': 5
        			  }
        			},

              {
        			  selector: 'edge.incomer-highlighted',
        			  style: {
        			    'line-color': '#81c784',
        			    'target-arrow-color': '#81c784',
        			    'width': 5
        			  }
        			},

              {
        			  selector: 'edge.notselected',
        			  style: {
        			    'opacity': '0.4'
        			  }
        			}
        		],

        		elements: $scope.dagJson,
      		});

        	$scope.cy.on('tap', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function(){
            try { // your browser may block popups
              if(this.data('tool') !== "https://hub.docker.com/_/" && this.data('tool') !== ""){
                window.open(this.data('tool'));
              }
            } catch(e){ // fall back on url change
              if(this.data('tool') !== "https://hub.docker.com/_/" && this.data('tool') !== ""){
                window.location.href = this.data('tool');
              }
            }
          });

           $scope.cy.on('mouseover mouseup', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function(e){
              var node = e.cyTarget;
              $scope.clearPopover();
              $scope.dynamicPopover.title = this.data('name');
              $scope.dynamicPopover.link = this.data('tool');
              $scope.dynamicPopover.type = this.data('type');
              $scope.dynamicPopover.docker = this.data('docker');
              $scope.dynamicPopover.run = this.data('run');
              $scope.$apply();

              var tooltip = node.qtip({
                content: {text: $('#tooltiptext'), title: node.data('name')},
                style: {
                  classes: 'qtip-bootstrap'
                }
              });
              var api = tooltip.qtip('api');
              api.toggle(true);
          });

          $scope.cy.on('mouseout mousedown', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function(e){
              var node = e.cyTarget;
              var api = node.qtip('api');
              api.toggle(false);
          });

          $scope.cy.on('mouseout', 'node', function(e) {
            var node = e.cyTarget;
            $scope.cy.elements().removeClass('notselected');
            node.connectedEdges().removeClass('outgoer-highlighted');
            node.connectedEdges().removeClass('incomer-highlighted');
          });

          $scope.cy.on('mouseover', 'node', function(e) {
            var node = e.cyTarget;
            $scope.cy.elements().difference(node.connectedEdges()).not(node).addClass('notselected');
            node.outgoers().addClass('outgoer-highlighted');
            node.incomers().addClass('incomer-highlighted');
          });

        } else {
          $scope.cy = window.cy = null;
        }
      };

      $scope.setDocument();

  }]);
