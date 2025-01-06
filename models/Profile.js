const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../db/dbConfig');




const Profile = sequelize.define('Profile', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    api_user: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    api_password: {
        type: DataTypes.STRING,
        allowNull  :true,
    },
}, 
{
    tableName: 'profiles',
}
);


module.exports = Profile;