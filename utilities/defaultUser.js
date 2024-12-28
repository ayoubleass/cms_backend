const { UUIDV4 } = require('sequelize');
const { hashPassword } = require('./hashPassword');
const { v4: uuidv4 } = require('uuid');

const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
});




const askQuestion = (question) => {
    return new Promise((resolve) => {
        readline.question(`${question}`, { hideEchoBack: true }, (res) => {
            resolve(res);
        });
    });
}


const collectUserData = async () => {
    const fields = ["name", "email", "password", "phoneNumber"];
    const user = {}
    for (const field of fields) {
        const value = await askQuestion(`Please enter your ${field}: `);
        user[field] = value;
        if (field === 'password') {
            const newVal = "*".repeat(value.length); 
            console.log(`your ${field} is : ${newVal}`);
            user[field] = await hashPassword(value);
        }else{
            console.log(`your ${field} is : ${value}`);
        }
    }
    readline.close();
    user.resetToken = uuidv4();
    user.isAdmin = true;
    return user
};


module.exports = collectUserData;
