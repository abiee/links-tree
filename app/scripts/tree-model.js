import Backbone from 'backbone';

var TreeModel = Backbone.Model.extend({
  urlRoot: 'http://localhost:3000/api/tree'
});

export default TreeModel;
