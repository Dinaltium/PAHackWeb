/**
 * Web Platform implementation for React Native
 */

const Platform = {
  OS: "web",
  select: function (obj) {
    return obj.web || obj.default || {};
  },
  Version: 1,
  isTesting: false,
  isTV: false,
};

export default Platform;
