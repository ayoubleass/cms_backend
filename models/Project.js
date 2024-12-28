const { DataTypes} = require('sequelize');
const sequelize = require('../db/dbConfig');


const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url :{
        type : DataTypes.STRING,
    },
}, {
    tableName : "projects",
});



module.exports = Project;