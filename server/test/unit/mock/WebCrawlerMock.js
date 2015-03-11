import events from 'events';
import _ from 'lodash';
import cheerio from 'cheerio';

export default class WebCrawlerMock {
  constructor() {
    this._results = {};
  }

  fetch(url) {
    var eventEmitter = new events.EventEmitter();

    _.defer(_.bind(function(url) {
      var result = this.getResult(url);
      var $ = cheerio.load(result);

      eventEmitter.emit('done', null, url, result, $);
    }, this), url);

    return eventEmitter;
  }

  getResult(url) {
    return this._results[url] || '';
  }

  setResult(url, html) {
    this._results[url] = html;
  }
}
