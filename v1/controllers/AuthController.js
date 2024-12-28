const {User} = require('../../models/associations');
const {verifyPassword, hashPassword} = require('../../utilities/hashPassword');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../../mail/sendEmail');
const BaseController = require('./BaseController')


class Auth extends BaseController{

  static signUp = async(req, res) => {
    try {
        const {name, email, password, phoneNumber, isAdmin} = req.body;
        const hashedPass = await hashPassword(password);
        const isSent =  await sendMail("signUp.html", req.body , "Welcome");
        if(isSent) {
            const user = await User.create({
                name,
                email,
                phoneNumber,
                password : hashedPass,
                isAdmin
            });
            if (user === null) {
                return res.status(400).json({error : "Failed to create user",});
            }
            const userData = Auth.removeByKey(user.get());
            return res.json(userData);
        }
    }catch(err) {
        console.error(err)
        return res.status(500).json({error : "Something is wrong"});
    }
  }



  static login = async(req, res) => {
    try {
        const {email, password} = req;
        const user = await User.findOne({where : {email}});
        if(user == null) {
            return res.status(404).json({ error : "user not found email must be incorrect", });
        }
        const valid = await verifyPassword(password, user.password); 
        console.log(valid);
        if(!valid) {
            return  res.status(400).json({ error : "Password is not a valid password", });
        }
        const token = uuidv4();
        user.connToken = token;
        await user.save();
        const userData = Auth.removeByKey(user.get());
        return res.json({token, userData});
    }catch(error){
        console.error(error);
        return res.status(500).json({error : 'Server error'});
    }
  }



  static forgotPassword = async(req, res) => {
    try {
        const email = req.body.email || null;
        console.log(email);
        if (!email) {
            return res.status(400).json({ error : 'Email is required'});
        }
        const user = await User.findOne({where : {email}});
        if(!user){
            return res.status(400).json({ error : "Email is incorrect", });
        }
        const token = uuidv4();
        user.resetToken = token;
        await user.save();
        await sendMail("forgotPassword.html", user.get() , "Reset password request");
        return res.json({ message : 'check your email for more details' });
    }catch(error) {
        console.error(error);
        return res.status(500).json({ error : 'Server error' });
    }
  }




  static resetPassword = async (req, res) => {
    try {
        const {email, resetToken, password} = req.body;
        console.log(req.body)
        const user = await User.findOne({where : {email}});
        if(!user) {
            return res.status(400).json({error : "User not found"});
        }
        if(user.resetToken === resetToken) {
            const hashedPass = await hashPassword(password);
            user.password = hashedPass;
            user.resetToken = null;
            await user.save();
            return res.json({message : 'password has been changed'});
        }
        return res.status(401).json({error : "token is not valid"});
    }catch(error){
        console.error(error);
        return res.status(500).json({error : "Failed to make changes"});
    }

  }

}


module.exports = Auth;