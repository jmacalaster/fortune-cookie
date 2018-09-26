module.exports = function(sequelize, DataTypes) {
  var Fortune = sequelize.define("Fortune", {
    text: DataTypes.STRING,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Fortune.associate = function(models) {
    Fortune.belongsTo(models.User, {
      as: "fromUser",
      foreignKey: "fromUserId"
    });
    Fortune.belongsTo(models.User, {
      as: "toUser",
      foreignKey: "toUserId"
    });
  };

  return Fortune;
};
