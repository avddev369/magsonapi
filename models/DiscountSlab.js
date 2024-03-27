module.exports = (sequelize, Sequelize) => {
    const DiscountSlab = sequelize.define('discount_slab', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        purchaseThreshold: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        discountPercentage: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        offer_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    DiscountSlab.associate = (models) => {
        DiscountSlab.belongsTo(models.Offer, { sourceKey:"id",foreignKey: 'offer_id' });
       
    };
    return DiscountSlab;
};
