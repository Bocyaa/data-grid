const path = require('path');
const tsConfigPaths = require('tsconfig-paths');

// Register path mapping with correct baseUrl for compiled JS
const cleanup = tsConfigPaths.register({
  baseUrl: path.join(__dirname, 'dist'),
  paths: {
    '*': ['*'],
    'generated/*': ['../src/generated/*'],
  },
});

// Load the main application
require('./dist/index.js');
