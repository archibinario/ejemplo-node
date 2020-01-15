const User = require('../../models/user');
const { comparePassword, generateJWT } = require('../../lib/helpers');

// maneja el inicio de sesión de un usuario
exports.login = async (req, res, next) => {
    try {
        // compruebo si email y password son validos, asi como si el usuario tiene algun bloqueo
        let user = await checkUser(req.body.email, req.body.password)
        // CREDENCIALES VALIDAS, INICIANDO SESION

        // inicio sesión con JWT
        let dataResponse = {
            jwt: await initJWT(user, req.ip)
        }
        // procesar y devolver el token de sesion
        res.prepareResponse(req, res, next, dataResponse, 'LOGIN_SUCCESSFUL');
    } catch (error) {
        next(error);
    }
}

// comprueba la validez de las credenciales del usuario (email y password)
async function checkUser(email, password) {
    return new Promise( async (resolve, reject) => {
        try {
            let user = await User.findOne({ email: email, deleted: false })
                .select('account_validated locked password first_login user_id role_name')
                .orFail(new Error('CREDENTIALS_NOT_VALID'));
            // email localizado pero cuenta no validada
            if (user.account_validated === false) {
                throw new Error('ACCOUNT_NOT_VALIDATED');
            };
            // email localizado pero cuenta de usuario bloqueada
            if (user.locked === true) {
                // TODO:
                // notificar al administrador de este evento
                throw new Error('ACCOUNT_LOCKED');
            };
            // cuenta aparentemente valida, comprobación de contraseña
            let passwordMatch = await comparePassword(password, user.password)
            if (passwordMatch === false) {
                //usuario encontrado pero credenciales no coinciden
                throw new Error('CREDENTIALS_NOT_VALID');
            };
            return resolve(user)
        } catch (error) {
            return reject(error)
        }
    })

}

// creo el jwt, almacenando en db el usuario, la ip del request y los permisos del usuario
async function initJWT(user, ip) {
    return new Promise( async (resolve, reject) => {
        try {
            let jwt = await generateJWT({
                user_uuid: user.user_uuid,
                user_id: user._id,
                ip: ip
            });
            return resolve(jwt)
        } catch (error) {
            return reject(error)
        }
    })
}