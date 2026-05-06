module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Zod v4 (and others) use `export * as ns from`; required before Metro bundles node_modules.
    '@babel/plugin-transform-export-namespace-from',
    // Must stay last (Reanimated === worklets plugin).
    'react-native-reanimated/plugin',
  ],
};
