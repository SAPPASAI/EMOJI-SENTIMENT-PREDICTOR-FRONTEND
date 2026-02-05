# 🎨 Mood Emoji AI — Frontend

Minimalist React interface that reveals the emotional vibe of any word.  
Paired with a Flask backend on Render • Deployed on Vercel

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

---

## 🌐 Live Demo

👉 **https://mood-emoji-frontend.vercel.app**

---

## 🚀 Quick Start

### Install dependencies
```bash
npm install
Run locally
bash
Copy code
npm run dev
📦 Build for Production
bash
Copy code
npm run build
🌐 Deployment
Vercel (Recommended)
Push the project to GitHub

Import the repository on Vercel

Done — auto-deploys on every push 🚀

Deploy via CLI
bash
Copy code
npm install -g vercel
vercel
🔧 Configuration
Update the backend API URL in src/App.jsx:

js
Copy code
const API_URL = import.meta.env.PROD
  ? 'https://your-backend.onrender.com' // ← Your Render URL
  : 'http://localhost:5000'
🛠️ Tech Stack
Framework: React 18

Bundler: Vite

Styling: CSS (Inter font + minimal utility classes)

Hosting: Vercel

🔗 Links
Live Demo: https://mood-emoji-frontend.vercel.app

Backend Repo: ../backend

Backend API: https://mood-emoji-backend.onrender.com

📝 License
MIT