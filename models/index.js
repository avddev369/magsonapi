const dbConfig = require("../config/database.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },

  // pool: {
  //   max: dbConfig.pool.max,
  //   min: dbConfig.pool.min,
  //   acquire: dbConfig.pool.acquire,
  //   idle: dbConfig.pool.idle
  // },
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Shop = require("./Shop.js")(sequelize, Sequelize);
db.Employee = require("./Employee.js")(sequelize, Sequelize);
db.Customer = require("./Customer.js")(sequelize, Sequelize);
db.Offer = require("./Offer.js")(sequelize, Sequelize);
db.DiscountSlab = require("./DiscountSlab.js")(sequelize, Sequelize);
db.Transaction = require("./Transaction.js")(sequelize, Sequelize);
db.Condition = require("./Condition.js")(sequelize, Sequelize);
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
