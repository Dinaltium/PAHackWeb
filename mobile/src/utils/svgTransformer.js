// Custom SVG transformer for React Native
const { default: svgr } = require("@svgr/core");
const fs = require("fs");

module.exports.transform = function ({ src, filename, options }) {
  // Convert SVG to React Native component
  const svgCode = fs.readFileSync(filename, "utf8");

  const svgrOptions = {
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    native: true,
    dimensions: true,
    typescript: true,
  };

  // Transform SVG to React Native component
  const jsCode = svgr.sync(svgCode, svgrOptions, {
    componentName: "SvgComponent",
  });

  return {
    code: jsCode,
  };
};
