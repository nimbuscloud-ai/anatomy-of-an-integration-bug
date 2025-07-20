const path = require('path');

// Use environment variable for database path, default to local path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../db/development.sqlite');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: dbPath
  }
};