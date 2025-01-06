const { error } = require('console');
const Validate = require('../utilities/validator');
const { unique } = require('../utilities/defaultErrorMessages');



const signUpValidate =  async (req, res, next) => {
    const validator = new Validate(req.body);
    await validator.rules({
                        password : {
                            length : {
                                max: 20,
                                min : 5
                            },
                            required : true, 
                        },
                        name : {required : true},
                        email : {
                                    required :true,
                                    unique : { module: 'User' },
                                    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"  
                                },
                        phoneNumber : {required : true , unique : { module : 'User'}}
                    });
    console.log(req.body);
    const errors = validator.getErrors();
    if(errors && Object.entries(errors).length > 0){
        return res.status(400).json({ errors });
    }
    next();
}



const loginValidate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const [authType, data] = authHeader.split(' ');
    if (authType !== 'Basic' || !data) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const decodedData = Buffer.from(data, 'base64').toString();
    const [email, password] = decodedData.split(':');
    console.log(email, password);
    const validator= new Validate({email, password});
    await validator.rules({
                        password : {
                            required : true, 
                        },
                        email : {
                                    required :true,
                                    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"  
                                },
                    });
    const errors = validator.getErrors();
    if(errors && Object.entries(errors).length > 0){
        return res.status(400).json({ errors });
    }
    req.email = email;
    req.password = password;
    next();
}


const resetPasswordValidate = async(req, res, next) => {
    const validator = new Validate(req.body);
    await validator.rules({
        password: {
            required : true,
            length : {
                max: 20,
                min : 5
            }
        },
    });
    const errors = validator.getErrors();
    if(errors && Object.entries(errors).length > 0){
        return res.status(400).json({ errors });
    }
    next();
}

module.exports = {
    signUpValidate,
    loginValidate,
    resetPasswordValidate,
};