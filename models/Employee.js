module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define('employee_master', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mobile: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isMaster: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: false
        },
        shop_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
 
    Employee.associate = (models) => {
        Employee.belongsTo(models.Shop, { sourceKey:"id",foreignKey: 'shop_id' });
       
    };
    return Employee;
};


