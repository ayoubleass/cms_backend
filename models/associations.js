const User = require('./User');
const Project = require('./Project');
const Result = require('./Results');



User.hasMany(Project);
Project.belongsTo(User);

Project.hasMany(Result);
Result.belongsTo(Project);



module.exports = {
    User,
    Project,
    Result,
}