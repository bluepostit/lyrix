'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    title: DataTypes.STRING,
    text: DataTypes.TEXT
  }, {});
  Song.associate = function(models) {
    Song.belongsTo(models.Artist);
  };
  return Song;
};