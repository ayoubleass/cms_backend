const {Profile} = require('../../models/associations');
const {verifyPassword, hashPassword} = require('../../utilities/hashPassword');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../../mail/sendEmail');
const BaseController = require('./BaseController')


class ProfileController extends BaseController {

    static create = async (req, res) => {
       try {
            const {api_user, api_password} = req.body;
            if(!api_user && !api_password)  {
                return res.status(400).json({error : "api_user and api_password fields are required"});
            }
            const userId = req.user.id;
            const newProfile = await Profile.create({
                api_password,
                api_user,
                userId,
            });
            if(!newProfile) {
                return res.status(400).json({error : "Fialed to create the user pkease try again"});
            }
            return res.status(200).json(newProfile);

       } catch (err)  {
            console.log(err);
            return res.status(500).json({error: 'Server error'});
       }
    }


    static update = async (req, res) => {
        try {
            const id = req.params.id;
            const {api_user, api_password} = req.body;
            console.log(req.body);
            if(!api_user && !api_password)  {
                return res.status(400).json({error : "api_user and api_password fields are required"});
            }
            const userId = req.user.id;
            let newProfile = await Profile.update({
                    api_password,
                    api_user,
                    userId,
                },
                {
                    where: {id},
                },
            );
            if(!newProfile) {
                return res.status(400).json({error : "Fialed to update the profile please try again"});
            }
            newProfile = await Profile.findByPk(id);
            return res.status(200).json(newProfile);
       } catch (err)  {
            console.log(err);
            return res.status(500).json({error: 'Server error'});
       }
    }

    static delete = async (req, res) => {
      try {
            const id = req.params.id;
            const profile = await Profile.findByPk(id);
            if(!profile) {
                return res.status(400).json({error : "Profile not found"});
            }
            await profile.destroy();
            return res.status(201).json({});
       } catch (err)  {
            console.log(err);
            return res.status(500).json({error: 'Server error'});
       }
    }

}


module.exports = ProfileController;