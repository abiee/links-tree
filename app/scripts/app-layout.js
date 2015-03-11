import Marionette from 'backbone.marionette';
import layoutTemplate from 'templates/layout';

export default class AppLayout extends Marionette.LayoutView {
  constructor(...rest) {
    this.template = layoutTemplate;
    this.regions = {
      tree: '#tree-container'
    };
    super(...rest);
  }
}
