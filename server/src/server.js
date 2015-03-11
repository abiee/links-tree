/* globals console */

import express from 'express';
import morgan from 'morgan';
import http from 'http';

import config from './config';
import Database from './Database';
import LinksTree from './LinksTree';

var app = express();
app.use(morgan('dev'));

// Allow CORS
app.use(function(req, res, next) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

var database = new Database();
var linksTree = new LinksTree(database);

app.get('/api/tree', function(req, res) {
  'use strict';

  linksTree.getLinksTree(config.url)
    .on('done', function(tree) {
      res.json(tree);
    });
});

http.createServer(app).listen(3000, function() {
  'use strict';

  console.log('Express server started!');
});
