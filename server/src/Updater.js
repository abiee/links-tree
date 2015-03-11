import events from 'events';
import _ from 'lodash';
import logger from './logger';
import WebCrawler from './crawler/WebCrawler';
import LinksCrawler from './crawler/LinksCrawler';

const SEG = 1000;

export default class Updater {
  constructor(url, depth, database) {
    this.updateTime = 5 * SEG;
    this.url = url;
    this.depth = depth;
    this.database = database;
    this.eventEmitter = new events.EventEmitter();
  }

  start() {
    this.update();
    setInterval(_.bind(this.update, this), this.updateTime);

    return this.eventEmitter;
  }

  update() {
    logger.log('info', '[Updater] Refreshing ' + this.url);
    var crawler = this.getLinksCrawler();
    var self = this;

    crawler.start(this.depth).on('done', function(result) {
      var pendingUrls = 0;
      var changed = false;

      _.forOwn(result, function(links, url) {
        pendingUrls += 1;

        self.database.get(url, function(databaseLinks) {
          pendingUrls -= 1;

          if (!databaseLinks) {
            self.database.store(url, links);
            self.eventEmitter.emit('added', url, links);
            self.eventEmitter.emit('changed', url);
            changed = true;
          } else {
            if (links.length !== databaseLinks.length) {
              self.database.store(url, links);
              self.eventEmitter.emit('modified', url, links);
              self.eventEmitter.emit('changed', url);
              changed = true;
            }
          }

          if (pendingUrls === 0) {
            self.eventEmitter.emit('done', changed);
          }
        });
      });
    });
  }

  getLinksCrawler() {
    var webCrawler = new WebCrawler();
    return new LinksCrawler(this.url, webCrawler);
  }
}
