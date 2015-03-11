import Backbone from 'backbone';

var StatisticsModel = Backbone.Model.extend({
  urlRoot: 'http://localhost:3000/api/statistics'
});

export default StatisticsModel;
