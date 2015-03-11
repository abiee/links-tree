/* jshint devel:true  */
import Marionette from 'backbone.marionette';
import io from 'io';
import AppLayout from 'app-layout';
import LoadingView from 'loading-view';
import TreeModel from 'tree-model';
import TreeView from 'tree-view';

var App = new Marionette.Application();
var socket = io('http://localhost:3000');

App.on('start', function() {
  'use strict';

  var links = new TreeModel();
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

  socket.on('updated', () => fetchAndShowTree());
  fetchAndShowTree();
});

App.start();
