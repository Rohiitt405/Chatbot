import express from "express";
import { chatTicket } from "./chat.js";

const app = express();
const chatHistory = [];

let historyQueue = Promise.resolve();

function useHistory(operation) {
  const result = historyQueue.then(operation);
  historyQueue = result.catch(() => { });
  return result;
}

app.use(express.text());

app.post("/api/chat", async (req, res) => {
  const ticket = req.body;

  if (!ticket || !ticket.trim()) {
    return res
      .status(400)
      .type("text/plain")
      .send("Ticket text is required.");
  }

  try {
    const chat = await useHistory(async () => {
      chatHistory.push({
        role: "user",
        parts: [
          {
            text: ticket,
          },
        ],
      });

      const response = await chatTicket(chatHistory);

      chatHistory.push({
        role: "model",
        parts: [
          {
            text: response,
          },
        ],
      });

      return response;
    });

    return res
      .status(200)
      .type("text/plain")
      .send(chat);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .type("text/plain")
      .send("Unable to summarize the ticket.");
  }
});

app.delete("/api/chat", async (req, res) => {
  try {
    await useHistory(async () => {
      chatHistory.length = 0;
    });

    return res
      .status(200)
      .type("text/plain")
      .send("History cleared!.");
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .type("text/plain")
      .send("Unable to clear history.");
  }
});

export default app;