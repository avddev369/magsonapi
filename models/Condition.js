module.exports = (sequelize, Sequelize) => {
    const Condition = sequelize.define('Condition', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        maxReedemDays: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        maxReedemAmount: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        shopId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return Condition;
};