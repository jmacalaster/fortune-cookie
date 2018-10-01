 var randomUser = function() {
  return this.findOne({
    where: {
      id: {
        [db.Sequelize.Op.ne]: req.body.fromUserId
      }//,
      // TURNED OFF FOR TESTING: 
      // In final production, we will want to choose a random user who hasn't been pinged in at least 18 hours (or so)
      // updatedAt: {
      //   [db.Sequelize.Op.lt]: new Date() - 18 * 60 * 60 * 1000
      // }
    },
    order: [
      db.Sequelize.fn('RAND')
    ]
  });
};

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    platform: {
      type: DataTypes.STRING,
      defaultValue: "Slack"
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

  User.randomUser = randomUser;
  User.prototype.randomUser = randomUser;

  return User;
};
