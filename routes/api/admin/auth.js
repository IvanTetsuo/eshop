const Router = require('express');
const router = new Router();
const controller = require('../../../controllers/authController');
const {check} = require('express-validator');
const restorePasswordController = require('../../../controllers/restorePasswordController');

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 16 символов').isLength({min:4, max:16}),
    check('email', 'invalid email').isEmail(),
], controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.getAdmins);
router.post('/refresh-token', controller.refreshingTokens);
router.post('/revoke-token', controller.revokeToken);

router.post('/send-restore-password-email', restorePasswordController.sendRestorePasswordEmail);
router.post('/restore-password/:restoreToken', restorePasswordController.restorePassword);
module.exports = router;