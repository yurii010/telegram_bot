const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Sequelize

const Sequelize = require('sequelize')
const { addOrUpdateUser, getUserLanguage } = require('./sequelize/info.model');

const token = '7187652540:AAEZ4YmQcESjSCttTnRmTWfwTKnfBXGupqw';
const webAppUrl = "https://main--dashing-buttercream-8dc15b.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userInfo = { userId: msg.from.id, username: msg.from.username, firstName: msg.from.first_name, languageCode: msg.from.language_code };
    const userLanguage = userInfo.languageCode;

    const languageStart = () => {
        if (userInfo.languageCode == "uk" || userInfo.languageCode == "ru") {
            return ("Заповніть форму нижче та загляніть в наш магазинчик😉");
        } else {
            return ("Fill form bottom and look at shop😉");
        }
    }

    if (text === '/start') {

        await bot.sendMessage(chatId, languageStart(), {
            reply_markup: {
                keyboard: [
                    [{ text: (userLanguage == 'uk' || 'ru' ? 'Відкрити форму' : 'Open form'), web_app: { url: webAppUrl + 'form' } }],
                ]
            }
        })
        addOrUpdateUser(userInfo);

        // await bot.sendMessage(chatId, "Internet shop", {
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{ text: 'Make an order', web_app: { url: webAppUrl } }]
        //         ]
        //     }
        // })  
    }

    if (msg?.web_app_data?.data) {
        const data = JSON.parse(msg?.web_app_data?.data);
        if (userLanguage == "uk" || userLanguage == "ru") {
            await bot.sendMessage(chatId, 'Ваша країна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваше місто: ' + data?.city);
            await bot.sendMessage(chatId, 'Ваша стать: ' + data?.subject);
            await bot.sendMessage(chatId, 'Дякуємо!');
        } else {
            await bot.sendMessage(chatId, 'Your country: ' + data?.country);
            await bot.sendMessage(chatId, 'Your city: ' + data?.city);
            await bot.sendMessage(chatId, 'Your subject: ' + data?.subject);
            await bot.sendMessage(chatId, 'Thank you!');
        }
    }

    const setLanguage = (totalPrice, products, language) => {
        if (language == 'uk' || language == 'ru') {
            return (`Вітаємо! Ваша загальна вартість: ${totalPrice} та фінальний список продуктів: ${products.map(item => item.title).join(', ')}`);
        } else {
            return (`Congratulations! Your total price: ${totalPrice}, and final list: ${products.map(item => item.title).join(', ')}`);
        }
    }

    app.post('/web-data', async (req, res) => {
        const { queryId, totalPrice, products } = req.body;
        try {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Successful',
                input_message_content: {
                    message_text: setLanguage(totalPrice, products, userLanguage),
                },
            });
            return res.status(200).json({})
        } catch (e) {
            return res.status(500).json({})
        }
    })

    app.post('/getUserLanguage', async (req, res) => {
        const { userId } = req.body;
        try {
            const userLanguage = await getUserLanguage(userId);
            const normLang = JSON.stringify(userLanguage);
            res.status(200).json(normLang);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`server on ${PORT}`);
});