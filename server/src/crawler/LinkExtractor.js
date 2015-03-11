import _ from 'lodash';

export default class LinkExtractor {
  constructor(hostFilter) {
    this.hostFilter = hostFilter;
  }

  extract($) {
    var urlsFound = [];

    $('a').each(function(index, a) {
      let link = $(a).attr('href');
      let text = _.trim($(a).text()) || link;

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
