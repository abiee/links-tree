import fixtures from './fixtures';
import WebCrawlerMock from './mock/WebCrawlerMock';
import LinksCrawler from '../../src/crawler/LinksCrawler';

describe('LinksCrawler', function() {
  beforeEach(function() {
    this.webCrawler = new WebCrawlerMock();

    this.webCrawler.setResult('http://empty.com/', fixtures.emptyPage);
    this.webCrawler.setResult('http://example.com/', fixtures.exampleCom);
    this.webCrawler.setResult('http://example.org/', fixtures.exampleOrg);
    this.webCrawler.setResult('http://example.com/something-2',
                              fixtures.exampleComSomething);
  });

  it('returns the url name an its links', function(done) {
    var crawler = new LinksCrawler('http://empty.com/', this.webCrawler);
    crawler.start()
      .once('crawled', function(url, links) {
        try {
          expect(url).to.equal('http://empty.com/');
          expect(links).to.be.an.instanceOf(Array);
          expect(links).to.be.empty;
          done();
        } catch (err) {
          done(err);
        }
      });
  });

  it('gets all the urls in the root page', function(done) {
    var crawler = new LinksCrawler('http://example.com/', this.webCrawler);

    crawler.start()
      .once('crawled', function(url, links) {
        try {
          expect(url).to.equal('http://example.com/');
          expect(links).to.be.an.instanceOf(Array);
          expect(links).to.have.a.lengthOf(4);
          done();
        } catch (err) {
          done(err);
        }
      });
  });

  it('follows second level links', function(done) {
    var crawler = new LinksCrawler('http://example.com/', this.webCrawler);

    var expectedCrawledUrls = [
      'http://example.com/',
      'http://example.com/something-else',
      'http://example.com/something-2',
      'http://example.com/something-3',
      'http://example.com/something-4'
    ]

    crawler.start(3)
      .once('done', function(result) {
        try {
          expect(result).to.not.be.undefined;
          expect(result).to.have.all.keys(expectedCrawledUrls);
          done();
        } catch (err) {
          done(err);
        }
      });
  });
});
