import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import http from 'http';

var app = express();
app.use(morgan('dev'));

http.createServer(app).listen(3000, function() {
  console.log('Express server started!');
});
