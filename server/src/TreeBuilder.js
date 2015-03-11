import _ from 'lodash';
import config from './config';

export default class TreeBuilder {
  constructor(database) {
    this.database = database;
  }

  buildTreeFor(url, depth, callback) {
    if (!callback) {
      callback = depth;
      depth = config.defaultDepth;
    }

    var tree = { url: url, children: [] };
    var _this = this;

    this.database.get(url, function(result) {
      var subtrees = result.length;

      result.forEach(function(item) {
        _this.buildSubtree(item, depth, function(subtree) {
          tree.children.push(subtree);

          if (--subtrees === 0) {
            callback(tree);
          }
        });
      });
    });
  }

  buildSubtree(item, depth, callback) {
    var _this = this;
    var itemCloned = _.clone(item);
    itemCloned.children = [];
    depth -= 1;

    _this.database.get(item.link, function(result) {
      if (depth > 0 && result && result.length > 0) {
        var subtrees = result.length;

        result.forEach(function(item) {
          _this.buildSubtree(item, depth, function(subtree) {
            itemCloned.children.push(subtree);
            if (--subtrees === 0) {
              callback(itemCloned);
            }
          });
        });
      } else {
        callback(itemCloned);
      }
    });
  }
}
