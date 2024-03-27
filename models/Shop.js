module.exports = (sequelize, Sequelize) => {
    const Shop = sequelize.define('shops_master', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        retainedPercentage: {
            type: Sequelize.FLOAT,
            allowNull: true 
        },
        passsword: {
            type: Sequelize.STRING,
            allowNull: false 
        }
    });

    return Shop;
};
