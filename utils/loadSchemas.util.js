const fs = require('fs');
const path = require('path');

const loadSchemas = (dir) => {
  const schemas = {};

  fs.readdirSync(dir).forEach((file) => {
    // Skip the index.js file to avoid circular references
    if (file !== 'index.js' && file.endsWith('.validation.js')) {
      // Use a more descriptive name for the schema key
      const schemaName = path.basename(file, '.validation.js');
      const formattedName = `${schemaName}Schema`; // Adjust this as needed

      schemas[formattedName] = require(path.join(dir, file));
    }
  });

  return schemas;
};

module.exports = loadSchemas;
