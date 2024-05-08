const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config');

const generateAccessToken = (id, roles) => {
    const payload = { id, roles }
    return jwt.sign(payload, secret, { expiresIn: '1h' })
}

class authController {
    async registration(req, res) {
        try {
            const userLang = req.headers['accept-language'];
            const errors = validationResult(req)
            const errorMessages = errors.array().map(err => err.msg);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errorMessages })
            }
            const { email, username, password } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                const message = userLang == 'ua' ? 'Користувач з такою поштовою адресою вже існує' : 'This email is already taken';
                return res.status(400).json({ message })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'user' })
            const user = new User({ email, username, password: hashPassword, roles: [userRole.value] })
            await user.save()
            return res.json({ message: 'User was successful created!' })
        } catch (error) {
            res.status(400).json({ message: 'Registration error' })
        }
    }
    async login(req, res) {
        try {
            const userLang = req.headers['accept-language'];
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const message = userLang == 'ua' ? 'Такого користувача не існує. Перевірте дані' : 'No such user exists. Check the data';
                return res.status(400).json({ message })
            }
            const validPasssword = bcrypt.compareSync(password, user.password)
            if (!validPasssword) {
                const message = userLang == 'ua' ? 'Пароль неправильний' : 'The password is incorrect';
                return res.status(400).json({ message })
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token });
        } catch (error) {
            console.log(error)
        }
    }
    async getUsers(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            const name = user.username;
            return res.json({ name });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new authController(); 