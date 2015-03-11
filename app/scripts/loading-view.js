import Marionette from 'backbone.marionette';
import loadingTemplate from 'templates/loading-view';

export default class LoadingView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = loadingTemplate;
    super(...rest);
  }
}
