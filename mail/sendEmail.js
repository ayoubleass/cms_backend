const nodemailer = require("nodemailer");
const fs = require('fs');
require('dotenv').config();
const dirPath = './template'

const getEmailTemplate = (path) => {
    try {
        return fs.readFileSync(`${dirPath}/${path}`, 'utf-8');    
    }catch(error){
        console.log(error);
    }
}




const generateTemplate = (path, data) => {
    let mainTemplate = getEmailTemplate('/main.html');
    let htmlTemplate = getEmailTemplate(path);
    for (const[key, value] of Object.entries(data)){
        htmlTemplate =  htmlTemplate.replace(`{{${key}}}`, value);
    }
    mainTemplate = mainTemplate.replace("{{content}}", htmlTemplate);
    return mainTemplate;
}



const sendMail = async (path,  data, subject) => {
        let transporter = null;
        if (process.env.P_STATUS === "dev") {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
            });
        }else {
            transporter = nodemailer.createTransport({
                service: process.env.SMTP_SERVICE,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_APP_PASS,
                },
            });
        }
        const message = {
            from: process.env.SMTP_USER,
            to : data.email,
            subject : subject,
            html : generateTemplate(path, data),
            text : ''
        };
        const info = await transporter.sendMail(message);
        if(info.messageId){
            return true;
        }
}



module.exports = sendMail;


