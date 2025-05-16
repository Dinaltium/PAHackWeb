/**
 * Web RCTNetworking polyfill for React Native
 */

class RCTNetworkingWeb {
  constructor() {
    this.isAvailable = true;
    this._listeners = {};
  }

  // Mock methods that might be called
  sendRequest() {}
  abortRequest() {}
  clearCookies() {}

  // Event listener methods
  addListener(eventType, listener) {
    if (!this._listeners[eventType]) {
      this._listeners[eventType] = [];
    }
    this._listeners[eventType].push(listener);
    return { remove: () => this.removeListener(eventType, listener) };
  }

  removeListener(eventType, listener) {
    if (!this._listeners[eventType]) {
      return;
    }
    this._listeners[eventType] = this._listeners[eventType].filter(
      (l) => l !== listener
    );
  }

  removeAllListeners(eventType) {
    if (eventType) {
      delete this._listeners[eventType];
    } else {
      this._listeners = {};
    }
  }
}

const RCTNetworking = new RCTNetworkingWeb();

export default RCTNetworking;
