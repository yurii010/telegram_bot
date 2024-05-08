const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (req, res, next) {

    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            res.status(400).json({ messageUa: 'Користувач не авторизований', messageEn: 'The user is not authorized' })
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        next()
    } catch (error) {
        console.log(e)
        res.status(400).json({ messageUa: 'Користувач не авторизований', messageEn: 'The user is not authorized' })
    }
}