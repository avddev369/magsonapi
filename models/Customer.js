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
        shop_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    Customer.associate = (models) => {
        Customer.belongsTo(models.Shop, { sourceKey:"id",foreignKey: 'shop_id' });
    };
    
    return Customer;
};

