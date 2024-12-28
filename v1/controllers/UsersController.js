const User= require('../../models/User');
const {hashPassword} = require('../../utilities/hashPassword');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../../mail/sendEmail');
const BaseController = require('./BaseController');
const { request } = require('express');


class UserController extends BaseController {

    static async showUser (req, res) {
        try {
            const id = req.params.id;
            const user = await User.findOne({where : {id}});
            if (user === null) {
                return res.status(400).json({ error: "not found"});
            }
            const userData = UserController.removeByKey(user.get())
            return res.json({ ...userData });
        } catch (err) {
            console.log(err);
            return res.status(500).json({error : 'Server error'});
        }

    }

    static async showUsers (req, res) {
        try {
            const page =  parseInt(req.query?.page)|| 0 ;
            const pageSize = parseInt(req.query?.pageSize) || 20; 
            const offset = page > 0 ? page * pageSize : page;
            const limit = pageSize;
            const users = await User.findAll({ offset, limit });
            users.map((user) => UserController.removeByKey(user.get()));
            return res.status(201).json({ ...users });
        }catch(err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async createUser(req, res) {
        try {
            const {name, email, password, phoneNumber, isAdmin} = req.body;
            const hashedPass = await hashPassword(password);
            const token =  uuidv4();
            const user = await User.create({
                name,
                email,
                phoneNumber,
                password : hashedPass,
                isAdmin,
                resetToken : token,
            });
            if (!user) {
                return res.status(400).json({error : "Failed to create user",});
            }
            await sendMail("createByAdmin.html", {email, password} , "Welcome");
            const userData = UserController.removeByKey(user.get())
            return res.status(201).json({ ...userData });    
        }catch(err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error'});
        }
    }


    static async updateUser (req, res) {
        try {
            const id = req.params.id;
            let user = await User.findOne({where : {id}});
            const {name, email, password, phoneNumber, isAdmin} = req.body;
            const data  = {};
            if (!user) return res.status(400).json({error : "not found",});
            if (user.email !== email) {
                data.email = email;
            }
            if (password) {
                data.password = await hashPassword(password);
            }
            if (user.phoneNumber !== phoneNumber) {
                data.phoneNumber = phoneNumber;
            }
            data.name = name;
            data.isAdmin = isAdmin;
            for (const [key, value] of Object.entries(data)) {
                user[key] = value;
            }
            user = await user.save();
            if (!user) return res.status(400).json({error : "can't update the user",});
            return res.status(201).json(UserController.removeByKey(user.get()));
        } catch(err) {
            console.log(err);
            return res.status(500).json({ error: "Server error"});
        }
    }
        


    static async deleteUser (req, res) {
        try {
            const id = request.params.id;
            const user = User.findOne({where : {id}});
            if (!user) {
                return res.status(400).json({ error : 'Not found' });
            }
            
            await user.destroy();
            return res.status(201).json({});
        } catch(err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error'});
        }
    }


}


module.exports = UserController;