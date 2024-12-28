const { where } = require('sequelize');
const errorMessages = require('./defaultErrorMessages');
const { Sequelize } = require('sequelize');


class Validate {

    static RULES = [
        'required',
        'length',
        'regex',
        'unique',
    ];

    constructor(fields = {}){
        this.fields = fields;
        this.errors = {};
        for(const[key, _] of Object.entries(fields)){
            this.errors[key] = [];
        }
    }


    async rules(fields_rules) {
        for (const[fieldName, rules] of Object.entries(fields_rules)){
            this.errors[fieldName] = [];
            for(const[ruleName , rule] of Object.entries(rules)){
                if(!Validate.RULES.includes(ruleName)) {
                    throw Error('Rules is not allowed');
                }
                if(rule){
                    switch(ruleName){
                        case  Validate.RULES[0]:
                            this.required(fieldName);
                            break;
                        case  Validate.RULES[1]:
                            this.length(fieldName, rule);
                            break; 
                        case Validate.RULES[2]:
                            this.regex(fieldName, rule);
                            break;
                        case Validate.RULES[3]:
                            await this.unique(fieldName, rule.module);
                            break; 
                    }    
                }
                  
            }     
        }
        return this;
    }

    required(fieldName){
        if(!this.fields || !this.fields[fieldName] || this.fields[fieldName].trim() === ''){
           const message = this.errors[fieldName];
           message.push(errorMessages.required);
        }
    }

    length (fieldName, length) {
        const field = this.fields[fieldName] || 0;
        console.log(length.min);
        if (field.length < length.min  ||  field.length > length.max){
            const messages = this.errors[fieldName];
            let errorMessage = errorMessages.length.replace('{min}', length.min);
            errorMessage = errorMessage.replace('{max}', length.max);
            messages.push(errorMessage);
        }
    }


    async unique (fieldName, module){
        const field = this.fields[fieldName];
        if (!module){
            throw Error("Please provide a module to check the record in the database");
        }
        const user = await require('../models/'.concat(module)).findOne({
        where:{
            [Sequelize.Op.or]: [
                { email : field },
                {phoneNumber : field},
            ]
        }})
        if (user) {
            const message = this.errors[fieldName];
            message.push(errorMessages.unique);
        }
    }


    regex(fieldName, regexPattern) {
        const field = this.fields[fieldName];
        const re = new RegExp(regexPattern);
        if(!re.test(field)) {
            const message = this.errors[fieldName];
            message.push(errorMessages.regex);
        }

    }

    getErrors(){
        for(const[key, value] of Object.entries(this.errors)){
            if(!value || value.length == 0) {
                delete this.errors[key]
            }
        }
        return this.errors;
    }
    
    isValid(){
        for(const[key, value] of Object.entries(this.errors)){
            if(value && value.length > 0) {
                return false;
            }
        }
        return true;
    }
}


module.exports = Validate;