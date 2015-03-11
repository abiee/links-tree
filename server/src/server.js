/* globals console */

import express from 'express';
import morgan from 'morgan';
import http from 'http';

var app = express();
app.use(morgan('dev'));

http.createServer(app).listen(3000, function() {
  'use strict';

  console.log('Express server started!');
});
