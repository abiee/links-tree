/* jshint devel:true  */
import Marionette from 'backbone.marionette';
import AppLayout from 'app-layout';
import LoadingView from 'loading-view';
import TreeModel from 'tree-model';
import TreeView from 'tree-view';

var App = new Marionette.Application();

App.on('start', function() {
  'use strict';

  var links = new TreeModel();
  var loadingView = new LoadingView();

  App.rootLayout = new AppLayout({ el: '#main' });
  App.rootLayout.render();
  App.rootLayout.getRegion('tree').show(loadingView);

  links.fetch({
    success: function() {
      var treeView = new TreeView({ model: links });
      App.rootLayout.getRegion('tree').show(treeView);
    }
  });
});

App.start();
