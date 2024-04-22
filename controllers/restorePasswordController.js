const mailer = require('../mailer/nodemailer');
const Admin = require('../models/Admin');
const RestoreToken = require('../models/RestoreToken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class RestorePasswordController {
    async sendRestorePasswordEmail(req, res) {
        try {
            const {username} = req.body;
            const user = await Admin.findOne({username});
            if (!user) {
                return res.status(400).json({message: 'Такого пользователя не существует'});
            }
            const activeRestoreToken = await RestoreToken.findOne({
                user: user._id, 
                revoked: {$exists: false}, 
                expires: {$gt: new Date()},
            });
            if (activeRestoreToken) {
                return res.json({message: 'Письмо уже было выслано'});
            }
            const restoreToken = new RestoreToken({
                user: user._id,
                token: randomTokenString(),
                expires: new Date(Date.now() + 1*24*60*60*1000),
            });
            await restoreToken.save();

            await mailer.sendMail({
                to: user.email,
                subject: `Восстановление пароля пользователя ${user.username}`,
                text: `localhost:3000/auth/restore-password/${restoreToken.token}`,
                html: `localhost:3000/auth/restore-password/${restoreToken.token}`,
            });
            res.json({message: 'Сообщение отправлено'});
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'woops'});
        }
    }

    async restorePassword(req, res) {
        try {
            const {restoreToken} = req.params;
            const {newPassword} = req.body;
            const restoreTokenDoc = await RestoreToken.findOne({token: restoreToken}).populate('user');
            if (!restoreTokenDoc || !restoreTokenDoc.isActive) {
                return res.json({error: 'ссылка на восстановление не действительна'});
            }
            restoreTokenDoc.user.password = await bcrypt.hash(newPassword, 7);
            await restoreTokenDoc.user.save();
            restoreTokenDoc.revoked = new Date();
            await restoreTokenDoc.save();
            res.json({message: 'Пароль успешно обновлён'});
        } catch(err) {
            console.log(err);
            res.status(400).json({error: 'woops'});
        }
    }
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

module.exports = new RestorePasswordController();