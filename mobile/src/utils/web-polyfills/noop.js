/**
 * Helper for creating no-operation polyfills
 */

// Simple noop function
const noop = () => {};

// Create a noop object with common methods
noop.addEventListener = noop;
noop.removeEventListener = noop;
noop.addListener = () => ({ remove: noop });
noop.removeAllListeners = noop;
noop.emit = noop;

// Use this to create an object with all methods as noops
export const createNoopObject = (methodNames = []) => {
  const obj = {};
  methodNames.forEach((methodName) => {
    obj[methodName] = noop;
  });
  return obj;
};

export default noop;
