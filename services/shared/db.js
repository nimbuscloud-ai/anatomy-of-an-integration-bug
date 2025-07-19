const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../db/development.sqlite'),
  logging: false
});

const Fare = sequelize.define('Fare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fare_amount: {
    type: DataTypes.FLOAT,
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