const Router = require('express').Router();

/* CONTROLADORES PUBLICOS */
const loginController = require('../controllers/core/loginController');
const registerController = require('../controllers/core/registerController');
const resetPasswordController = require('../controllers/core/resetPasswordController');

/* MIDDLEWARES */
const jwt = require('../middlewares/core/jwt');
const { validator } = require('../validators/index');

/* ENPOINTS PUBLICOS */
Router.get('/', (req, res, next) => {
    res.prepareResponse(req, res, next, { message: 'hello' })
})
Router.post('/register', validator, registerController.register);
Router.get('/validate/:token', validator, registerController.validateAccount);
Router.post('/login', validator, loginController.login);
Router.post('/reset-password', validator, resetPasswordController.authRequestResetPassword);
Router.get('/reset-password/:token', validator, resetPasswordController.validateTokenResetPassword);
Router.put('/reset-password', validator, resetPasswordController.resetPassword);

/* ENPOINTS PRIVADOS */
Router.use(jwt);

/*
 ...
*/

module.exports = Router;