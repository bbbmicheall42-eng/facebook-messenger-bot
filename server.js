export default {
  async fetch(request, env) {

    if (request.method === "GET") {
      const url = new URL(request.url);

      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      // Temporary verification test
      if (
        mode === "subscribe" &&
        token === "mybot_verify_2026"
      ) {
        return new Response(challenge, { status: 200 });
      }

      return new Response("Forbidden", { status: 403 });
    }

    if (request.method === "POST") {
      const body = await request.json();

      if (body.object === "page") {
        for (const entry of body.entry || []) {
          for (const event of entry.messaging || []) {

            if (event.message && event.sender && !event.message.is_echo) {
              const senderId = event.sender.id;

              await fetch(
                `https://graph.facebook.com/v26.0/me/messages?access_token=${env.PAGE_ACCESS_TOKEN}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    recipient: {
                      id: senderId
                    },
                    message: {
                      text: "لالاڪ حسـناء هيا مَلكة جمـال المغࢪب 🫶🏻"
                    }
                  })
                }
              );
            }
          }
        }

        return new Response("EVENT_RECEIVED", { status: 200 });
      }

      return new Response("Not a page event", { status: 404 });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};
