const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Use environment variable for database path, default to local path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../db/development.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

const Fare = sequelize.define('Fare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fare_amount: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'fares',
  timestamps: true,
});

module.exports = {
  sequelize,
  Fare
};