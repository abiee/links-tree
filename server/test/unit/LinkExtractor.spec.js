import cheerio from 'cheerio';
import fixtures from './fixtures';
import LinkExtractor from '../../src/crawler/LinkExtractor';

describe('LinkExtractor', function() {
  beforeEach(function() {
    this.linkExtractor = new LinkExtractor();
    this.$examplePage = cheerio.load(fixtures.exampleCom);
  });

  it('extracts all links in a page', function() {
    var linkExtractor = new LinkExtractor();
    var links = linkExtractor.extract(this.$examplePage);
    expect(links).to.be.instanceOf(Array);
    expect(links).to.have.a.lengthOf(4);
  });

  it('extracts text and link for each anchor tag', function() {
    var links = this.linkExtractor.extract(this.$examplePage);
    links.forEach(function(item) {
      expect(item).to.have.all.keys('text', 'link');
    });
  });

  it('ignores invalid links', function() {
    var $ = cheerio.load('<a>foo</a>');
    var links = this.linkExtractor.extract($);
    expect(links).to.be.empty;
  });
});
