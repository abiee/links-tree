/* jshint devel:true  */
/* globals io */
import Marionette from 'backbone.marionette';
import AppLayout from 'app-layout';
import LoadingView from 'loading-view';
import TreeModel from 'tree-model';
import StatisticsModel from 'statistics-model';
import TreeView from 'tree-view';
import StatisticsView from 'statistics-view';

var App = new Marionette.Application();
var socket = io('http://localhost:3000');

App.on('start', function() {
  'use strict';

  var links = new TreeModel();
  var statistics = new StatisticsModel();
  var loadingView = new LoadingView();

  App.rootLayout = new AppLayout({ el: '#main' });
  App.rootLayout.render();
  App.rootLayout.getRegion('tree').show(loadingView);

  function fetchAndShowTree() {
    links.fetch({
      success: function() {
        var treeView = new TreeView({ model: links });
        App.rootLayout.getRegion('tree').show(treeView);
      }
    });
  }

  function fetchAndShowStatistics() {
    statistics.fetch({
      success: function() {
        var statisticsView = new StatisticsView({ model: statistics });
        App.rootLayout.getRegion('statistics').show(statisticsView);
      }
    });
  }

  socket.on('updated', function() {
    fetchAndShowTree();
  });

  socket.on('fetched', function() {
    fetchAndShowStatistics();
  });

  fetchAndShowTree();
  fetchAndShowStatistics();
});

App.start();
