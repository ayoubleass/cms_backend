const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../db/dbConfig');

const MonthlySearch = sequelize.define('MonthlySearch', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    year : {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    search_volume: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    month : {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName: 'monthly_searches',
}
);


module.exports = MonthlySearch;