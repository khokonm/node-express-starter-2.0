const fs = require('fs');
const path = require('path');

/**
 * Dynamically loads and exports all .js modules in a directory.
 * @param {string} dir - The directory to load modules from.
 * @returns {object} An object with all exported modules merged.
 */
function loadControllers(dir) {
  const controllers = {};

  // Read all .js files in the specified directory, excluding index.js
  const files = fs.readdirSync(dir).filter(file => file !== 'index.js' && file.endsWith('.js'));

  // Require each file and merge its exports into the controllers object
  for (const file of files) {
    const filePath = path.join(dir, file);
    const controllerModule = require(filePath);
    Object.assign(controllers, controllerModule);
  }

  return controllers;
}

module.exports = loadControllers;
