const isAdmin = (req, res, next) => {
    const isAdmin = req?.user?.isAdmin;
    if (!isAdmin) return res.status(403).json({error : "Forbidden "});
    next();
}



module.exports = isAdmin;