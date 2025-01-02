const User = require('./User');
const Project = require('./Project');
const Result = require('./Results');
const MonthlySearch = require('./MonthlySearch');


User.hasMany(Project);
Project.belongsTo(User);

Project.hasMany(Result);
Result.belongsTo(Project);

Result.hasOne(MonthlySearch, {
  onDelete: 'CASCADE',
  hooks: true,
});
MonthlySearch.belongsTo(Result);

module.exports = {
    User,
    Project,
    Result,
    MonthlySearch,
}