module.exports = app => {
    const offer = require("../controllers/offerController.js");

    var router = require("express").Router();

    router.post("/offers", offer.offer);
    app.use("/", router);
};
      
