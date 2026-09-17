import express from "express";
import { chatTicket } from "./chat.js";

const app = express();
const chatHistory = [];

let historyQueue = Promise.resolve();

function useHistory(operation) {
  const result = historyQueue.then(operation);
  historyQueue = result.catch(() => {});
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

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

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

      const response = await chatTicket(
        chatHistory,
        (chunk) => {
          res.write(chunk);
        }
      );

      chatHistory.push({
        role: "model",
        parts: [
          {
            text: response,
          },
        ],
      });
    });

    res.end();
  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        content: "Unable to process the request.",
      })}\n\n`
    );
    res.end();
  }
});

app.delete("/api/chat", async (req, res) => {
  try {
    await useHistory(async () => {
      chatHistory.length = 0;
    });

    res
      .status(200)
      .type("text/plain")
      .send("History cleared!.");
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .type("text/plain")
      .send("Unable to clear history.");
  }
});

export default app;