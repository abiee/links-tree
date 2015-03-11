import Marionette from 'backbone.marionette';
import treeViewTemplate from 'templates/tree-view';
import 'jstree/dist/jstree';

export default class TreeView extends Marionette.ItemView {
  constructor(...rest) {
    this.className = 'showback';
    this.template = treeViewTemplate;
    this.ui = { tree: '#links-tree' };
    super(...rest);
  }

  onShow() {
    this.ui.tree.jstree({
      core: {
        data: this.model.toJSON().children
      } 
    });
  }
}
