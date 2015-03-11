import _ from 'lodash';

export default class Database {
  constructor() {
    this._urls = {};
    this._cache = {};
  }

  store(link, data) {
    this._urls[link] = data;
  }

  get(link, callback) {
    _.defer(_.bind(function() {
      callback(this._urls[link]);
    }, this));
  }

  cache(link, tree) {
    this._cache[link] = tree;
  }

  getCached(link, callback) {
    _.defer(_.bind(function() {
      callback(this._cache[link]);
    }, this));
  }

  uncahe(link) {
    this._cache[link] = undefined;
  }
}
