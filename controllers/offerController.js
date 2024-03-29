
const db = require("../models");
const myRes = require("../utils/responseHandler");

exports.offer = async (req, res) => {
    try {
        const { shop_id } = req.body; 
        
        const offers = await db.Offer.findAll({
            where: { shop_id}, 
            include: [{
                model: db.DiscountSlab,
                attributes: ['id', 'purchaseThreshold', 'discountPercentage'],
                as: 'discountSlabs' 
            }],
            attributes: ['id', 'offerName', 'startDate', 'endDate', 'disabled'],
            order: [['id', 'ASC']] 
        });

        myRes.successResponse(res, offers);
    } catch (error) {
        console.error('Error fetching offers:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' });
    }
};

