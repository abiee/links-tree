import events from 'events';
import url from 'url';
import _ from 'lodash';

var DEFAULT_DEPTH = 2;

export default class LinksCrawler {
  constructor(urlRoot, crawler, linkExtractor) {
    this.urlRoot = urlRoot;
    this.crawler = crawler;
    this.linkExtractor = linkExtractor;
  }

  start(depth) {
    var eventEmitter = new events.EventEmitter();
    depth = depth || DEFAULT_DEPTH;

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

        linksToFollow.forEach(_.bind(function(pendingUrl) {
          this.crawlUrl(pendingUrl, depth, eventEmitter, crawledUrls);
        }, this));
      } else {
        eventEmitter.emit('done', crawledUrls);
      }
    }, this));
  }

  fetchLinks(url, depth, callback) {
    this.crawler.fetch(url).on('done', _.bind(function(error, url, result, $) {
      var linksFound = this.extractUrls($);
      var linksToFollow = [];

      if (depth > 1) {
        linksToFollow = this.getLinksToFollow(linksFound);
      }

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
