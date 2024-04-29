const Sequelize = require("sequelize");
const sequelize = new Sequelize('bot', 'root', '', { host: '127.0.0.1', dialect: 'mysql' });

const usersInfo = sequelize.define("usersInfo", {
    userId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING(50),
    },
    first_name: {
        type: Sequelize.STRING(50),
    },
    language_code: {
        type: Sequelize.STRING(50),
    },
})

const addUser = (info) => {
    sequelize.sync().then(() => {
        usersInfo.create({
            userId: info.userId,
            username: info.username,
            first_name: info.firstName,
            language_code: info.languageCode,
        })
    })
}

module.exports = {
    addUser
}


