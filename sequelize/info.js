const Sequelize = require("sequelize");
const sequelize = new Sequelize('bot', 'root', '',
    {
        host: '127.0.0.1',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
})

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

sequelize.sync().then(() => {
    console.log('Book table created successfully!');
 
    usersInfo.create({
        userId: "1",
        username: "test",
        first_name: "test",
        language_code: "test"
    })
 })
