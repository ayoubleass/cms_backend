const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConfig');


const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    keyword : {
        type: DataTypes.STRING,
        allowNull : false,
    },
    location : {
        type: DataTypes.STRING,
        allowNull : true,
    },
    keyword_difficulty:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    search_volume : {
        type: DataTypes.INTEGER,
        validate: {
            min : 0,
        }
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},{
     tableName: 'results',
});



module.exports = Result;