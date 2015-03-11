import WebCrawler from '../../src/crawler/WebCrawler';

describe('WebCrawler', function() {
  it('fetchs an url and its callback has the url name', function(done) {
    var crawler = new WebCrawler();

    crawler.fetch('http://www.example.com/')
      .on('done', function(error, url, result, $) {
        try {
          expect(error).to.be.null;
          expect(url).to.be.equal('http://www.example.com/');
          done();
        } catch (err) {
          done(err);
        }
      });
  });
});
