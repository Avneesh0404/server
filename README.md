# ⚡ WebRTC Signaling Server

A lightweight **WebRTC signaling server** built with **Node.js** and **Socket.IO**.  
It helps peers exchange offers, answers, and ICE candidates to establish peer-to-peer connections.  
You can **run it as a backend** or **embed it directly inside your frontend** — no separate server needed!

---

## 🧩 Features

- 🔌 Real-time WebRTC signaling with Socket.IO  
- 🧠 Handles rooms, offers, answers, and ICE candidates  
- ⚙️ Easy `.env` configuration  
- 🌍 Supports frontend integration (no backend required)

---

## 🚀 Option 1: Run as a Separate Server

### 1️⃣ Clone and install
```bash
git clone https://github.com/Avneesh0404/server.git
cd server
npm install
```
### 2️⃣ Create .env
```bash
PORT=8000
CORS_ORIGIN=http://localhost:5173
```
### 3️⃣ Start server
```bash
npm start
