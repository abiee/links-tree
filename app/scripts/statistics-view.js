import Marionette from 'backbone.marionette';
import statisticsTemplate from 'templates/statistics-view';
import moment from 'moment';

export default class StatisticsView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = statisticsTemplate;
    super(...rest);
  }

  serializeData() {
    var serializedData = {};

    var lastDateUpdated = this.model.get('lastDateUpdated');
    var lastDateChanged = this.model.get('lastDateChanged');

    if (lastDateUpdated) {
      serializedData['lastDateUpdated'] = moment(lastDateUpdated).fromNow();
    }

    if (lastDateChanged) {
      serializedData['lastDateChanged'] = moment(lastDateChanged).fromNow();
    }

    return serializedData;
  }

  onRender() {
    // Re-render every 15 seconds
    setInterval(() => this.render(), 15000);
  }
}
