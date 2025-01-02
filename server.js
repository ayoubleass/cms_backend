const express = require('express');
const app = express()
const sequelize = require('./db/dbConfig.js');
const router = require('./routes/index.js.js');
const { v4: uuidv4 } = require('uuid');
const collectUserData = require('./utilities/defaultUser.js');
const {User, Project} = require('./models/associations.js');
const cors = require('cors')
const PORT = 3000;
const projects = require('./db/testData.js');

app.use(express.json());
app.use(cors({
  origin : '*'
}))

app.use('/api/v1', router);


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
      return res.status(400).json({
        error: 'Invalid JSON format. Please ensure your JSON is properly formatted.',
        details: err.message,
      });
    }
    next(err); 
});


app.listen(PORT, async () => {
  try {
    await sequelize.sync({force: false});    
    const user  = await User.findOne({where: {id : 1}});
    if (user === null) {
      let userData = {};
      userData = await collectUserData();
      const newUser = await User.create(userData);
      if(newUser) {
        console.log("Your account is created!!!");
      }  
    }
    console.log(`Example app listening on PORT ${PORT}`);
  }catch(err) {
    console.log(err)
  }
});
