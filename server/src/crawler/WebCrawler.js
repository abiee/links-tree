import events from 'events';
import Crawler from 'crawler';
import logger from '../logger';

export default class WebCrawler {
  fetch(url) {
    var crawler = this._getCrawlerInstance();
    var eventEmitter = new events.EventEmitter();

    logger.log('debug', '[Webcrawler] Queued ' + url);
    crawler.queue({
      uri: url,
      callback: function(error, result, $) {
        logger.log('debug', '[Webcrawler] ' + url + ' fetched successfully');
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
