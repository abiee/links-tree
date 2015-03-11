import _ from 'lodash';

export default class LinkExtractor {
  constructor(hostFilter) {
    this.hostFilter = hostFilter;
  }

  extract($) {
    var urlsFound = [];

    $('a').each(function(index, a) {
      let text = $(a).text();
      let link = $(a).attr('href');

      if (!_.isUndefined(link)) {
        urlsFound.push({
          text: text,
          link: link
        });
      }
    });

    return urlsFound;
  }
}
