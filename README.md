# Kirk Kinnell AI Negotiation Coach

## Overview

This project is an interactive web application that connects users with a suite of AI-powered negotiation and education agents, powered by ElevenLabs Conversational AI. Users can select from a menu of negotiation help, educational modules, and conflict simulators, and then interact with a voice-enabled AI agent tailored to their chosen scenario.

**Key Features:**
- Friendly agent selection menu with multiple learning and simulation options
- Real-time voice conversation with AI agents (using ElevenLabs)
- Animated visual feedback that changes based on agent speaking status
- Modern, responsive UI

---

## Tech Stack

- **Frontend:**  
  - HTML5, CSS3 (custom, modern design)
  - Vanilla JavaScript (ES6+)
  - Canvas-based sprite animation
- **Backend:**  
  - Node.js with Express.js
  - Serves static files and acts as a proxy for ElevenLabs API
- **AI/Voice:**  
  - ElevenLabs Conversational AI SDK
  - Multiple agent configurations (system prompt, voice, etc. set in ElevenLabs dashboard)
- **Build Tools:**  
  - Webpack (bundling JS/CSS, copying assets and HTML)
  - copy-webpack-plugin (for static assets and HTML files)
- **Other:**  
  - dotenv for environment variable management

---

## Project Structure

```
app/
  backend/
    server.js           # Express backend server
  src/
    index.html          # Main app page (voice chat UI)
    select-agent.html   # Agent selection menu
    app.js              # Main frontend logic
    styles.css          # App styling
    assets/
      animation_grid.png
      animation_grid_listening.png
  dist/
    ...                 # Built/served static files
```

---

## Installation & Setup

### 1. **Clone the repository**
```sh
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. **Install dependencies**
```sh
cd app
npm install
```

### 3. **Set up environment variables**
Create a `.env` file in `app/` with your ElevenLabs API key and a default agent ID:
```
XI_API_KEY=your_elevenlabs_api_key
AGENT_ID=your_default_agent_id
PORT=3000
```

### 4. **Build the frontend**
```sh
npm run build
```
This will bundle your JS/CSS and copy all assets and HTML files to `dist/`.

### 5. **Start the backend server**
```sh
npm start
```
The server will run on [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Open the agent selection page:**  
   [http://localhost:3000/static/select-agent.html](http://localhost:3000/static/select-agent.html)

2. **Choose a scenario:**  
   Click a button to select your learning or simulation path.

3. **Interact with the AI agent:**  
   You'll be taken to the main app page, where you can start a real-time voice conversation with the selected agent.

4. **Visual feedback:**  
   The animated grid changes based on whether the agent is speaking or listening.

---

## Adding/Editing Agents

- To add more agents, edit `select-agent.html` and add more buttons with the desired agent IDs.
- To change agent behavior (system prompt, voice, etc.), edit the agent in the ElevenLabs dashboard.

---

## Troubleshooting

- If images or pages don't load, make sure your build process copies all assets and HTML files to `dist/`.
- Check your `.env` file for correct API keys and agent IDs.
- Use the browser's DevTools (Network tab) to debug missing files or 404 errors.

---

## License

MIT (or your preferred license)

---

Let us know if you want to add more details, usage screenshots, or deployment instructions!
