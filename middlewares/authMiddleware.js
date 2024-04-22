const jwt = require('jsonwebtoken');
const {secret} = require('../config');
module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        if (!req.headers.authorization) {
            return res.status(401).json({message: 'Пользователь не авторизован'});
        }
        const [ , token] = req.headers.authorization.split(' ');
        if (!token) {
            return res.status(401).json({message: 'Пользователь не авторизован'});
        }
        const decodedData = jwt.verify(token, secret);
        req.userId = decodedData.id;
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({message: 'Пользователь не авторизован'});
    }
};