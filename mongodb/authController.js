const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Problem with registration!' })
            }
            const { username, password } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({ message: 'Користувач з таким іменем вже існує' })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'user' })
            const user = new User({ username, password: hashPassword, role: [userRole.value] })
            await user.save()
            return res.json({ message: 'User was successful created!' })
        } catch (error) {
            res.status(400).json({ message: 'Registration error' })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: `Користувач ${user} не знайдений` })
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