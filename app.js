const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/whatsapp', async (req, res) => {
    const incomingMsg = req.body.Body;
    console.log(`Received message: ${incomingMsg}`);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: incomingMsg,
        });

        const replyText = response.text || "عذراً، لم أستطع توليد رد.";

        res.set('Content-Type', 'text/xml');
        res.send(`<Response><Message>${replyText}</Message></Response>`);
    } catch (error) {
        console.error(error);
        res.set('Content-Type', 'text/xml');
        res.send(`<Response><Message>حدث خطأ في الاتصال بجيميني.</Message></Response>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
