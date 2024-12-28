const bcrypt = require('bcrypt');



const hashPassword = async (password, saltRounds = 10) => {
    if (!password) {
        throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
};




const verifyPassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) return true
    return false;
}


module.exports = {
    hashPassword,
    verifyPassword
};