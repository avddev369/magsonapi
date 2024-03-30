module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define('customer_master', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        total_trancCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        balance: {
            type: Sequelize.DOUBLE,
            defaultValue: 0
        },
        reedem: {
            type: Sequelize.DOUBLE,
            defaultValue: 0
        },

        shop_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    Customer.associate = (models) => {
        Customer.belongsTo(models.Shop, { foreignKey: 'shop_id', onDelete: 'CASCADE' });
        Customer.hasMany(models.Transaction, { foreignKey: 'customerId', onDelete: 'CASCADE' }); 
    };
    
    return Customer;
};

