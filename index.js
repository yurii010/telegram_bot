const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const token = '7187652540:AAEZ4YmQcESjSCttTnRmTWfwTKnfBXGupqw';
const webAppUrl = "https://main--dashing-buttercream-8dc15b.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, "Fill form bottom and look at shop😉", {
            reply_markup: {
                keyboard: [
                    [{ text: 'Open form', web_app: { url: webAppUrl + 'form' } }],
                    [{ text: 'GET', callback_data: 'get' }]
                ]
            }
        })
        /*
        await bot.sendMessage(chatId, "Internet shop", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Make an order', web_app: { url: webAppUrl } }]
                ]
            }
        })
        */
    }
    bot.action('get', (ctx) => {
        let user = ctx.update.callback_query.from; ctx.telegram.sendMessage(7777298909547, `${user.username} took the thing`);
        console.log(ctx);
    });

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId, 'Your country: ' + data?.country);
            await bot.sendMessage(chatId, 'Your city: ' + data?.city);
            await bot.sendMessage(chatId, 'Your subject: ' + data?.subject);
            await bot.sendMessage(chatId, 'Thank you!');
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    const { queryId, products, totalPrice } = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Successful',
            input_message_content: { message_text: `Congratulation! Your total price: ${totalPrice}, and finally list: ${products.map(item => item.title).join(', ')}`, },
        });
        return res.status(200).json({})
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`server on ${PORT}`);
});