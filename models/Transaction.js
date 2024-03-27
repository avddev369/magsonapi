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


    // Transaction.addHook('beforeCreate', async (transaction, options) => {
    //     const { Customer } = require('./Customer'); // Import Customer model here to avoid circular dependency
    //     const customer = await Customer.findByPk(transaction.customerId);
    //     if (customer) {
    //         const retainedPercentage = customer.retainedPercentage || 0;
    //         const retainedAmount = (retainedPercentage / 100) * transaction.amount;
    //         transaction.redeemedAmount = Math.min(customer.totalRedeemedAmount, transaction.discountedAmount || 0);
    //         const remainingRedeemedAmount = customer.totalRedeemedAmount - transaction.redeemedAmount;
    //         customer.totalRedeemedAmount = remainingRedeemedAmount + retainedAmount;
    //         await customer.save();
    //     }
    // });

    return Transaction;
};