import events from 'events';
import _ from 'lodash';

export default class LinksCrawlerMock {
  constructor(urlRoot, mockResponse) {
    this.urlRoot = urlRoot;
    if (mockResponse) {
      this._response = mockResponse;
    }
  }

  start() {
    var eventEmitter = new events.EventEmitter();
    
    _.defer(_.bind(function() {
      eventEmitter.emit('done', this.getResponse());
    }, this));

    return eventEmitter;
  }

  setResponse(response) {
    this._response = response;
  }

  getResponse() {
    return this._response || {};
  }
}
