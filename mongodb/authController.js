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
            const errors = validationResult(req)
            const errorMessages = errors.array().map(err => err.msg);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errorMessages })
            }
            const { email, username, password } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: 'Користувач з такою поштовою адресою вже існує' })
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
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: `Такого користувача не існує. Перевірте дані` })
            }
            const validPasssword = bcrypt.compareSync(password, user.password)
            if (!validPasssword) {
                return res.status(400).json({ message: `Пароль неправильний` })
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token });
        } catch (error) {
            console.log(error)
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new authController(); 