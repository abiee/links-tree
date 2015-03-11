import events from 'events';
import Crawler from 'crawler';

export default class WebCrawler {
  fetch(url) {
    var crawler = this._getCrawlerInstance();
    var eventEmitter = new events.EventEmitter();

    crawler.queue({
      uri: url,
      callback: function(error, result, $) {
        eventEmitter.emit('done', error, url, result, $);
      }
    });

    return eventEmitter;
  }

  _getCrawlerInstance() {
    if (!this._crawler) {
      this._crawler = new Crawler();
    }

    return this._crawler;
  }
}
