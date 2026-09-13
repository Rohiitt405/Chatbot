import express from "express";
import { summarizeTicket } from "./summarize.js";

const app = express();

app.use(express.text());

app.post("/api/summarize", async (req, res) => {
  const ticket = req.body;

  if (!ticket || !ticket.trim()) {
    return res
      .status(400)
      .type("type/plain")
      .send("Ticket text is required.");
  }

  try {
    const summary = await summarizeTicket(ticket);

    return res
      .status(200)
      .type("text/plain")
      .send(summary);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .type("text/plain")
      .send("Unable to summarize the ticket.");
  }
});

export default app;