import TreeBuilder from '../../src/TreeBuilder';
import Database from '../../src/Database';

describe('TreeBuilder', function() {
  beforeEach(function() {
    var database = new Database();

    database.store('http://example.com/', [{
      text: 'Foo',
      link: 'http://example.com/foo'
    }, {
      text: 'Bar',
      link: 'http://example.com/bar'
    }]);
    database.store('http://example.com/foo', [{
      text: 'Baz',
      link: 'http://example.com/baz'
    }]);
    database.store('http://example.com/baz', [{
      text: 'John Doe',
      link: 'http://example.com/john-doe'
    }]);
    database.store('http://example.com/bar', []);

    this.builder = new TreeBuilder(database);
  });

  it('builds a tree from database data', function(done) {
    var expectedTree = {
      url: 'http://example.com/',
      children: [{
        text: 'Bar',
        link: 'http://example.com/bar',
        children: []
      }, {
        text: 'Foo',
        link: 'http://example.com/foo',
        children: [{
          text: 'Baz',
          link: 'http://example.com/baz',
          children: [{
            text: 'John Doe',
            link: 'http://example.com/john-doe',
            children: []
          }]
        }]
      }]
    }

    this.builder.buildTreeFor('http://example.com/', 5, function(tree) {
      try {
        expect(tree).to.not.be.undefined;
        expect(tree).to.be.deep.equal(expectedTree);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('builds a tree with the right depth', function(done) {
    var expectedTree = {
      url: 'http://example.com/',
      children: [{
        text: 'Bar',
        link: 'http://example.com/bar',
        children: []
      }, {
        text: 'Foo',
        link: 'http://example.com/foo',
        children: [{
          text: 'Baz',
          link: 'http://example.com/baz',
          children: []
        }]
      }]
    }

    this.builder.buildTreeFor('http://example.com/', 2, function(tree) {
      try {
        expect(tree).to.not.be.undefined;
        expect(tree).to.be.deep.equal(expectedTree);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
