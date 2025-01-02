const User = require('../models/User');


const isAuth = async (req, res, next) => {
    const connToken = req.header('X-Token');
    if (!connToken) return res.status(401).json({ error: "UNAUTHORIZED" });
    const user = await User.findOne({where : {connToken : connToken}});
    if (user === null) return res.status(401).json({ error: "UNAUTHORIZED" });
    console.log(user.id);
    req.user = {
        id : user.id,
        isAdmin : user.isAdmin,
    };
    next();
}







module.exports = isAuth;