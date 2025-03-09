const path = require("path");
const moduleAlias = require('module-alias');

// Explicitly add the aliases relative to the project directory
moduleAlias.addAliases({
  '@controllers': path.join(__dirname, '../controllers'),
  '@events': path.join(__dirname, '../events'),
  '@libs': path.join(__dirname, '../libs'),
  '@middleware': path.join(__dirname, '../middleware'),
  '@models': path.join(__dirname, '../models'),
  '@routes': path.join(__dirname, '../routes'),
  '@services': path.join(__dirname, '../services'),
  '@styles': path.join(__dirname, '../styles'),
  '@themes': path.join(__dirname, '../themes'),
  '@utils': path.join(__dirname, '../utils'),
  '@validations': path.join(__dirname, '../validations'),
  '@views': path.join(__dirname, '../views')
});

// register the folder alias
require('module-alias/register');