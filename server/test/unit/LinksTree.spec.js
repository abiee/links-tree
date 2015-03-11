import LinksTree from '../../src/LinksTree';
import Database from '../../src/Database';
import LinksCrawlerMock from './mock/LinksCrawlerMock';

var mockData = [{
  text: 'foo',
  link: 'http://example.com/bar'
}];

class LinksTreeWithMock extends LinksTree {
  getLinksCrawler(url) {
    var result = {};
    result[url] = mockData;

    return new LinksCrawlerMock(url, result);
  }
}

describe('LinksTree', function() {
  it('retuns link tree stored in database if already crawled', function(done) {
    var database = new Database();
    var linksTree = new LinksTreeWithMock(database);

    database.store('http://example.com/', mockData);

    linksTree.getLinksTree('http://example.com/').on('done', function(tree) {
      try {
        expect(tree).to.be.not.undefined;
        expect(tree).to.be.deep.equal({
          url: 'http://example.com/',
          children: [{
            text: 'foo',
            link: 'http://example.com/bar',
            children: []
          }]
        });
        done();
      } catch (err) {
        done(err)
      }
    });
  });

  it('uses LinkCrawler if requested url not in the database', function(done) {
    var database = new Database();
    var linksTree = new LinksTreeWithMock(database);

    linksTree.getLinksTree('http://example.com/').on('done', function(tree) {
      try {
        expect(tree).to.be.not.undefined;
        expect(tree).to.be.deep.equal({
          url: 'http://example.com/',
          children: [{
            text: 'foo',
            link: 'http://example.com/bar',
            children: []
          }]
        });
        done();
      } catch (err) {
        done(err)
      }
    });
  });
});
