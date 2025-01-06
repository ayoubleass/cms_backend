
class BaseController {

    static MODEL_NAME = 'User';
    
    static fillabale() {
        return {
            'User' : ['name', 'email', 'isAdmin', 'Profile'],
            'Projects' : []
        }
    }

    static removeByKey (fields) {
        for (const[key, value] of Object.entries(fields)) {
            if (!BaseController.fillabale()[BaseController.MODEL_NAME].includes(key)){
                delete fields[key]
            }
        }
        return fields;
    }

}


module.exports = BaseController;
