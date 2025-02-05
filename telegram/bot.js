require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.GROUP_CHAT_ID; // ID del grupo de Telegram

const bot = new TelegramBot(botToken, { polling: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Responder al comando /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}, ¡bienvenido a mi bot de prueba! 🤖`);
});

// Enviar notificación desde la URL
app.post('/notify', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensaje no proporcionado" });
    }

    bot.sendMessage(chatId, `🔔 Notificación: ${message}`)
        .then(() => res.json({ success: true, message: "Notificación enviada al grupo" }))
        .catch((err) => res.status(500).json({ error: "Error enviando mensaje", details: err }));
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
