// Simple SVG transformer for React Native
const fs = require("fs");

module.exports.transform = function ({ src, filename, options }) {
  try {
    // Read the SVG file
    const svgCode = fs.readFileSync(filename, "utf8");

    // Create a simple React Native component that renders the SVG as an image
    const componentName = "SvgComponent";
    const base64Content = Buffer.from(svgCode).toString("base64");

    // Generate a simple component that uses Image to display the SVG
    const jsCode = `
      import React from 'react';
      import { Image } from 'react-native';
      
      const ${componentName} = (props) => {
        return (
          <Image 
            source={{ uri: 'data:image/svg+xml;base64,${base64Content}' }}
            style={props.style || { width: 100, height: 100 }}
            {...props}
          />
        );
      };
      
      export default ${componentName};
    `;

    return {
      code: jsCode,
    };
  } catch (error) {
    console.error("Error in SVG transformer:", error);
    // Return a placeholder component in case of error
    return {
      code: `
        import React from 'react';
        import { View, Text } from 'react-native';
        
        const SvgComponent = (props) => {
          return (
            <View style={props.style || { width: 100, height: 100, backgroundColor: '#ccc' }}>
              <Text>SVG Error</Text>
            </View>
          );
        };
        
        export default SvgComponent;
      `,
    };
  }
};
