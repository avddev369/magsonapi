module.exports = app => {
    const user = require("../controllers/userController.js");

    var router = require("express").Router();

    router.post("/login", user.login);
    
    router.get("/customers", user.customers);

    router.post("/getAllCustomer", user.getAllCustomer);
    router.post("/getTopCustomerByPurchase", user.getTopCustomerByPurchase);
    router.post("/getTotalCounts", user.getTotalCounts);
    router.post("/getTodayTotalCounts", user.getTodayTotalCounts);
    
    app.use("/", router);
};
      