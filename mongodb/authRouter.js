const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require('express-validator');
const authMiddleWare = require('../middleware/authMiddleWare')
const roleMiddleWare = require('../middleware/roleMiddleWare')

router.post('/registration', [
    check('username', 'Заповніть це поле').notEmpty(),
    check('password', 'Пароль повинен бути від 4 до 15 елементів').isLength({ min: 4, max: 10 })
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleWare(['admin']), controller.getUsers)

module.exports = router