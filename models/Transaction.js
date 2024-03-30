module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transaction', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        shopId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        discountedAmount: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        redeemedAmount: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0
        }
    });

    Transaction.associate = (models) => {
       Transaction.belongsTo(models.Customer, { foreignKey: 'customerId', onDelete: 'CASCADE' });
       Transaction.belongsTo(models.Shop, { foreignKey: 'shopId', onDelete: 'CASCADE' });
    };




    return Transaction;
};