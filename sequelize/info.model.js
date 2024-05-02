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

const addOrUpdateUser = async (info) => {
    const [user, created] = await usersInfo.findOrCreate({
        where: { userId: info.userId },
        defaults: {
            username: info.username,
            first_name: info.firstName,
            language_code: info.languageCode,
        },
    });

    if (!created) {
        await user.update({
            username: info.username,
            first_name: info.firstName,
            language_code: info.languageCode,
        });
    }
};

const getUserLanguage = async (userId) => {
    const user = await usersInfo.findOne({
        where: { userId: userId },
        attributes: ['language_code'],
    });
    return user.language_code;
};

module.exports = {
    addOrUpdateUser,
    getUserLanguage,
}


