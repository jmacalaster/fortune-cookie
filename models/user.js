module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    platform: {
      type: DataTypes.STRING,
      defaultValue: "Slack"
    },
    canReceive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Fortune, {
      as: "fromUser",
      foreignKey: "fromUserId",
      onDelete: "set null"
    });
    User.hasMany(models.Fortune, {
      as: "toUser",
      foreignKey: "toUserId",
      onDelete: "set null"
    });
  };

  return User;
};
