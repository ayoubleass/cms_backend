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
    keywordDifficulte:{
        type: DataTypes.ENUM,
        values: ['medium', 'hard', 'low'],
        defaultValue: 'low'
    },
    searchVolume : {
        type: DataTypes.INTEGER,
        validate: {
            min : 0,
        }
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{
     tableName: 'results',
});



module.exports = Result;