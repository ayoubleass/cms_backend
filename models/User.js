const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../db/dbConfig');




const User = sequelize.define("user", {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    phoneNumber : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    email : {
        type : DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type : DataTypes.STRING,
        allowNull : false,
    },
    resetToken : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    connToken : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    isAdmin : {
        type : DataTypes.BOOLEAN,
    }
});



module.exports = User;