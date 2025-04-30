/**
 * Storybook webpack configuration
 */
export default ({ config }) => {
  // Add TypeScript support
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: "babel-loader",
  });

  // Add TypeScript file extensions
  config.resolve.extensions.push(".ts", ".tsx");
  
  return config;
};
