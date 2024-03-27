module.exports = (sequelize, Sequelize) => {
    const Offer = sequelize.define('offer', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        offerName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        disabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        shop_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    
    Offer.associate = (models) => {
        Offer.hasMany(models.DiscountSlab, { sourceKey:"id",foreignKey: 'offer_id', as: 'discountSlabs' });
        Offer.belongsTo(models.Shop, { sourceKey:"id",foreignKey: 'shop_id' });
       
    };
    
    return Offer;
};