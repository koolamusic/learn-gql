'use strict';
module.exports = (sequelize, DataTypes) => {
  const trips = sequelize.define('trips', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  trips.associate = function(models) {
    // associations can be defined here
  };
  return trips;
};