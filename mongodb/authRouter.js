const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require('express-validator');
const authMiddleWare = require('../middleware/authMiddleWare')
const roleMiddleWare = require('../middleware/roleMiddleWare')

const languageCheck = (req) => {
    const userLang = req.headers['accept-language'];
    return userLang == 'uk' ? check('password', 'Пароль повинен бути від 4 до 10 елементів').isLength({ min: 4, max: 10 }) :
        check('password', 'Password must be between 4 and 10 characters').isLength({ min: 4, max: 10 });
};

router.post('/register', (req, res, next) => {
    const validator = languageCheck(req);
    validator(req, res, next);
}, controller.registration);
router.post('/login', controller.login)
router.post('/users', controller.getUsers)

module.exports = router