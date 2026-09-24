# 🤖 AI Chatbot | Gemini-Powered Multi-Tool Assistant

An AI chatbot based on the Google Gemini that utilizes **Node.js, Express** and **Google Gemini API**. It consumes **REST** interface to perform streaming and provides intelligent responses to the input questions. Besides, the chatbot is able to access various external tools, such as a calculator, weather forecast, currency exchange, and website builder.

---

## 💡 Project Idea

> **"What if a chatbot could not just answer questions, but actually do things?"**

This project focuses on the concept of **AI function calling (tool use)**, which refers to the model's ability to decide when to call external functions on its own. It also has the following features: saving the **history** of the conversation for context understanding in **multi-turn dialogues**, **streaming** the response back to the user in real-time, and having a clear separation between the model and the tool layer, which allows for easy expansion and customization.

An excellent way to understand how modern AI assistants work.

---

## ✨ Features

### 🧠 Conversational AI with Memory
- Powered by **Google Gemini** (`gemini-3.5-flash-lite`)
- Remembers the full conversation history across multiple messages
- Context-aware replies — ask follow-up questions naturally

### ⚡ Real-Time Streaming Responses
- Responses are streamed **chunk by chunk** as the model generates them
- No waiting for the full reply feels instant and responsive
- Built on HTTP streaming (`res.write()`) via Express

### 🔧 Intelligent Tool Use (Function Calling)
The AI automatically decides which tool to call based on your message:

| Tool | What it does |
|------|-------------|
| 🧮 **Calculator** | Arithmetic operations = add, subtract, multiply, divide, mod, power |
| 🌤️ **Weather** | Fetches live current weather for any city via WeatherAPI |
| 💱 **Currency Converter** | Gets real-time exchange rates between any two currencies via Frankfurter API |
| 🌐 **Website Builder** | Generates complete HTML/CSS/JS websites and saves them to disk |

### 🌐 Website Builder (AI Agent Mode)
- Ask the AI to "build a portfolio website" or "create a landing page for a coffee shop"
- The AI acts as a **frontend developer agent** — it creates directories, writes `index.html`, `style.css`, and `script.js` files autonomously
- Generated sites are saved in a sandboxed `generated-sites/` folder
- Path traversal is blocked for security

### 🔄 Clear Chat History
- A dedicated `DELETE /api/chat` endpoint resets the conversation
- Start fresh anytime without restarting the server

### 🔒 Concurrency-Safe History
- Chat history is updated through a **promise queue** to prevent race conditions in concurrent requests

---

## 🗂️ Project Structure

```
Chatbot/
├── server.js              # Entry point — starts the Express server
├── app.js                 # Route definitions (POST & DELETE /api/chat)
├── chat.js                # Gemini AI integration + tool-calling loop
├── Tools/
│   ├── index.js           # Registers all tools (definitions + functions)
│   ├── calculator.js      # Arithmetic calculator tool
│   ├── weather.js         # Live weather fetcher tool
│   ├── getExchangeRate.js # Currency exchange rate tool
│   └── websiteBuilder/
│       └── websiteOperations.js  # File system tools for website generation
├── .env.example           # Environment variable template
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- A **Google Gemini API Key** → [Get one here](https://aistudio.google.com/app/apikey)
- A **WeatherAPI Key** → [Get one here](https://www.weatherapi.com/)
- (Currency API uses [Frankfurter](https://frankfurter.dev/) — no key needed)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Rohiitt405/Chatbot.git
cd Chatbot

# 2. Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_weatherapi_key_here
PORT=port_number
```

### Run the Server

```bash
# Development (auto-restarts on file change)
npm run dev

# Production
node server.js
```

Server starts at → `http://localhost:8000`

---

## 📡 API Reference

### Send a Message
```http
POST /api/chat
Content-Type: text/plain

What is 128 divided by 4?
```
**Response:** Streams plain text back in real time.

---

### Clear Conversation History
```http
DELETE /api/chat
```
**Response:** `200 OK` — `"History cleared!"`

---

## 💬 Example Prompts

| What you type | What happens |
|---------------|-------------|
| `"What is 25 to the power of 3?"` | Calculator tool is called |
| `"What's the weather in Tokyo right now?"` | Weather API is called |
| `"Convert 500 USD to INR"` | Exchange rate API is called |
| `"Build me a portfolio website"` | AI generates full HTML/CSS/JS files on disk |
| `"Explain how neural networks work"` | AI answers directly (no tool needed) |
| `"What did I ask you earlier?"` | AI recalls from conversation history |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express v5** | HTTP server & routing |
| **@google/genai** | Google Gemini API SDK |
| **dotenv** | Environment variable management |
| **WeatherAPI** | Live weather data |
| **Frankfurter API** | Real-time currency exchange rates |

---

## 🔭 How It Works (Architecture)

```
User Message
     │
     ▼
POST /api/chat  (app.js)
     │
     ▼
chatTicket()  (chat.js)
     │
     ├──► Gemini generates response
     │         │
     │         ├── Text response? ──► Stream to user ✅
     │         │
     │         └── Tool call? ──► Execute tool (calculator / weather / currency / filesystem)
     │                                  │
     │                                  └── Result fed back to Gemini ──► Loop again
     │
     ▼
Streamed plain-text response to client
```

The core loop in `chat.js` continues until Gemini returns a **pure text response** (no more tool calls), which is then streamed to the user.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Add your tool in `Tools/` and register it in `Tools/index.js`
4. Submit a pull request with a clear description

---

## 📄 License

This project is licensed under the **ISC License**.

---

*Built with curiosity, Node.js, and a bit of AI magic. ✨*
