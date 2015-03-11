import events from 'events';
import _ from 'lodash';
import config from './config';
import WebCrawler from './crawler/WebCrawler';
import LinksCrawler from './crawler/LinksCrawler';
import TreeBuilder from './TreeBuilder';

export default class LinksTree {
  constructor(database) {
    this.database = database;
  }

  getLinksTree(url, depth) {
    depth = depth || config.defaultDepth;
    var eventEmitter = new events.EventEmitter();

    this.database.get(url, _.bind(function(result) {
      if (!result) {
        this.fetchAndSaveLinksFromServer(url, depth, _.bind(function() {
          this.buildAndCacheTree(url, depth, function(tree) {
            eventEmitter.emit('done', tree);
          });
        }, this));
      } else {
        this.database.getCached(url, _.bind(function(cachedTree) {
          if (cachedTree) {
            eventEmitter.emit('done', cachedTree);
          } else {
            this.buildAndCacheTree(url, depth, function(tree) {
              eventEmitter.emit('done', tree);
            });
          }
        }, this));
      }
    }, this));

    return eventEmitter;
  }

  fetchAndSaveLinksFromServer(url, depth, callback) {
    var crawler = this.getLinksCrawler(url);

    crawler.start(depth).on('done', _.bind(function(result) {
      _.forOwn(result, _.bind(function(links, url) {
        this.database.store(url, links);
      }, this));
      
      callback();
    }, this));
  }

  buildAndCacheTree(link, depth, callback) {
    this.getTreeBuilder().buildTreeFor(link, depth, _.bind(function(tree) {
      this.database.cache(link, tree);
      callback(tree);
    }, this));
  }

  getLinksCrawler(url) {
    var webCrawler = new WebCrawler();
    return new LinksCrawler(url, webCrawler);
  }

  getTreeBuilder() {
    return new TreeBuilder(this.database);
  }
}
