const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// اختبار webhook مع Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// استقبال رسائل Messenger
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        if (event.message && event.sender) {
          const senderId = event.sender.id;

          await fetch(
            `https://graph.facebook.com/v26.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                recipient: { id: senderId },
                message: {
                  text: "سلام صافا عليك ❤️ حاليا أنا مكاينش، فاش نرجع غادي نهضر معاك."
                }
              })
            }
          );
        }
      }
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
