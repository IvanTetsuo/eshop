const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const RefreshToken = require('../models/RefreshToken');
const crypto = require('crypto');

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

module.exports = {
    generateRefreshToken,
    randomTokenString,
    getRefreshToken,
    generateAccessToken,
};