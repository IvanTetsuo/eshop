const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const RefreshToken = require('../models/RefreshToken');
const crypto = require('crypto');
class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регстрации', errors});
            }
            const {username, password, email} = req.body;
            // const username = req.body.username;
            // const password = req.body.password;
            const candidate = await Admin.findOne({username});
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'});
            }
            const hashPassword = await bcrypt.hash(password, 7);
            const user = new Admin({username, password: hashPassword, email});
            await user.save();
            return res.json({message: 'Пользователь успешно зарегестрирован'});
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'Registration error'});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await Admin.findOne({username});
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`});
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: 'Пароль неверный'});
            }
            // (1) создание accessToken'a при логине
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            await refreshToken.save(); // сохраняем в базу mongoDB (.save - lib mongoose)
            return res.json({accessToken, refreshToken: refreshToken.token});
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'Login error'});
        }
    }

    async getAdmins(req, res) {
        try {
            const users = await Admin.find();
            res.json(users);
        } catch(err) {
            console.log(err);
        }
    }

    // обновление пары access-refresh токенов, получая уже имеющийся токен
    async refreshingTokens(req, res) {
        const token = req.body.refreshToken;
        const refreshToken = await getRefreshToken(token);
        const {user} = refreshToken;

        // replace old refresh token with a new one and save
        const newRefreshToken = generateRefreshToken(user);
        refreshToken.revoked = Date.now();
        refreshToken.replacedByToken = newRefreshToken.token;
        await refreshToken.save();
        await newRefreshToken.save();

        // generate new jwt (Access)
        const accessToken = generateAccessToken(user);
        
        res.json({accessToken, refreshToken: newRefreshToken.token});
    }

    async revokeToken(req, res, next) {
        try {
            const refreshToken = req.body.refreshToken; // берём старый токен
            if (!refreshToken) return res.status(400).json({ message: 'Token is required' });

            const refreshingToken = await getRefreshToken(refreshToken);
            if (req.userId !== refreshingToken.user._id.toString()) {
                return res.status(400).json({message: 'Не соответствует refresh'});
            }

            refreshingToken.revoked = Date.now();
            await refreshingToken.save();
            
            res.json({message: 'Token revoked'})
        } catch(err) {
            res.status(400).json({message: 'Не получилось отозвать токен'});
        }
    }
}

function generateRefreshToken(user) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000), // 7 дней жизни refreshToken'a
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

async function getRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function generateAccessToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({id: user._id}, secret, {expiresIn: '20min'});
}


module.exports = new authController();