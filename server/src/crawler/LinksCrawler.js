import events from 'events';
import url from 'url';
import _ from 'lodash';
import config from '../config';
import logger from '../logger';
import LinkExtractor from './LinkExtractor';

var urlPat = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?.*)?$/;

export default class LinksCrawler {
  constructor(urlRoot, crawler) {
    this.urlRoot = urlRoot;
    this.crawler = crawler;
    this.linkExtractor = new LinkExtractor();
  }

  start(depth) {
    var eventEmitter = new events.EventEmitter();
    depth = depth || config.defaultDepth;

    logger.log('debug', '[LinksCrawler] Will fetch ' + this.urlRoot + ' ' +
                        'with a depth of ' + depth);

    this.pendingUrlsToFollow = 1;
    this.pickedUrls = [this.urlRoot];
    this.crawlUrl(this.urlRoot, depth, eventEmitter);

    return eventEmitter;
  }

  crawlUrl(url, depth, eventEmitter, crawledUrls) {
    crawledUrls = crawledUrls || {};

    this.fetchLinks(url, depth, _.bind(function(url, linksFound, linksToFollow) {
      crawledUrls[url] = linksFound;
      this.pendingUrlsToFollow += linksToFollow.length - 1;

      // Prevent duplicated or circular links
      this.pickedUrls = _.union(this.pickedUrls, linksToFollow);

      eventEmitter.emit('crawled', url, linksFound);
      
      // If no more pendiing urls to fetch, we're done
      if (this.pendingUrlsToFollow > 0) {
        depth -= 1;
        logger.log('debug', '[LinksCrawler] Still ' + 
                            this.pendingUrlsToFollow + ' links to check');

        linksToFollow.forEach(_.bind(function(pendingUrl) {
          this.crawlUrl(pendingUrl, depth, eventEmitter, crawledUrls);
        }, this));
      } else {
        logger.log('verbose', '[LinkCrawler] All links followed. ' + 
                              'Finished successfully');
        eventEmitter.emit('done', crawledUrls);
      }
    }, this));
  }

  fetchLinks(url, depth, callback) {
    this.crawler.fetch(url).on('done', _.bind(function(error, url, result, $) {
      if (!$) { // Ignore links that are not html
        callback(url, [], []);
        return;
      }

      logger.log('verbose', '[LinksCrawler] Extracting links of ' + url);
      var linksFound = this.extractUrls($);

      var linksToFollow = [];
      if (depth > 1) {
        linksToFollow = this.getLinksToFollow(linksFound);
      }

      logger.log('verbose', '[LinksCrawler] ' + linksFound.length + ' ' +
                            'links found and ' + linksToFollow.length + ' ' +
                            'will be followed in ' + url);

      callback(url, linksFound, linksToFollow);
    }, this));
  }

  extractUrls($) {
    return this.linkExtractor.extract($);
  }

  getLinksToFollow(links) {
    var linkList = _.pluck(links, 'link');
    return _.filter(linkList, function(link) {
      if (_.indexOf(this.pickedUrls, link) !== -1) {
        return false;
      }

      return this.shouldFollowLink(link);
    }, this);
  }

  shouldFollowLink(link) {
    if (!this.hostFilter) {
      var parsedUrlRool = url.parse(this.urlRoot);
      this.hostFilter = parsedUrlRool.host;
    }

    var parsedUrl = url.parse(link);
    return parsedUrl.host === this.hostFilter;
  }
}
