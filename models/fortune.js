module.exports = function (sequelize, DataTypes) {
    var Fortune = sequelize.define("Fortune", {
        text: DataTypes.STRING,
    });

    Fortune.associate = function (models) {
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
