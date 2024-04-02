module.exports = app => {
    const transaction = require("../controllers/transactionController.js");

    var router = require("express").Router();

    router.post("/createTransaction", transaction.createTransaction);
    router.post("/getAllTransaction", transaction.getAllTransaction);
    router.post("/insertTransaction", transaction.insertTransaction);
    router.post("/getAllTransactionByDate", transaction.getAllTransactionByDate);
    router.post("/updateConditionByShopId", transaction.updateConditionByShopId);
    app.use("/", router);
};
      