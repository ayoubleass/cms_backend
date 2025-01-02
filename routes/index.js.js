const Auth = require('../v1/controllers/AuthController');
const UserController = require('../v1/controllers/UsersController');
const ProjectController = require('../v1/controllers/ProjectController');
const ResultsController = require('../v1/controllers/ResultsController');


const  isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/isAuth');
const {signUpValidate, loginValidate, resetPasswordValidate} = require('../middleware/isRequestBodyValide');
const express = require('express');
const router = express.Router({});

//Auth endpoints
router.post('/signUp',signUpValidate,  Auth.signUp);
router.post('/login', loginValidate,  Auth.login);
router.post('/forgotPassword', Auth.forgotPassword);
router.put('/resetPassword',resetPasswordValidate,  Auth.resetPassword);


//User endpoints
router.get('/users', [isAuth, isAdmin], UserController.showUsers);
router.get('/users/:id', [isAuth, isAdmin], UserController.showUser);
router.post('/users', [isAuth, isAdmin, signUpValidate], UserController.createUser);
router.put('/users/:id', [isAuth, isAdmin], UserController.updateUser);
router.delete('/users/:id', [isAuth, isAdmin], UserController.deleteUser);

//Project endpoints
router.get('/projects', [isAuth], ProjectController.showProjects);
router.post('/projects', [isAuth], ProjectController.create);
router.put('/projects/:id',[isAuth], ProjectController.update);
router.delete('/project/:id', [isAuth], ProjectController.delete);

//Results
router.post('/projects/:id', [isAuth], ResultsController.create);
router.get('/projects/:id/results', [isAuth],ProjectController.showProjectResults);



module.exports = router;