# 🚀 DevRandomKit

A collection of simple, powerful developer tools built to solve everyday problems — fast, free, and without distractions.

> **No signups. No rate limits. No bloat. Just tools.**

---

## 🛠️ Available Tools

| Tool                   | Category    | Description                                    |
| ---------------------- | ----------- | ---------------------------------------------- |
| 🔑 API Key Generator   | Development | Generate secure API keys instantly             |
| 🔐 Password Generator  | Security    | Create strong and secure passwords             |
| 🆔 UUID Generator      | Development | Generate unique identifiers in bulk            |
| 🎲 Random Number       | Utilities   | Generate random numbers with range control     |
| 👤 Fake User Generator | Testing     | Generate realistic mock user data for testing  |
| 🎨 Color Generator     | Design      | Generate palettes, convert and explore colors  |
| 🔓 JWT Token Generator | Development | Create, decode and verify JWT tokens           |
| #️⃣ Hash Generator      | Security    | Generate MD5, SHA family, BLAKE2 & HMAC hashes |
| 📱 QR Code Generator   | Utilities   | Create QR codes for URLs and text instantly    |

---

## 📁 Project Structure

```
devRandomKit/
├── frontend/       # React + Vite + Tailwind CSS
└── backend/        # Node.js + Express + MongoDB
```

---

## ⚙️ Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React, Vite, Tailwind CSS |
| Backend  | Node.js, Express          |
| Database | MongoDB                   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas URI)
- npm or yarn

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

The frontend will be running at `http://localhost:5173` by default.

---

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

The backend API will be running at `http://localhost:5000`.

---

## 🌱 Environment Variables

### Frontend (`frontend/.env`)

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

### Backend (`backend/.env`)

| Variable    | Description                 |
| ----------- | --------------------------- |
| `PORT`      | Port for the Express server |
| `MONGO_URI` | MongoDB connection string   |

---

## 🎯 Core Principles

- ⚡ **Fast by Default** — Every tool responds instantly with no unnecessary loading states.
- 🔒 **Privacy First** — Your inputs are never stored or logged. Everything runs in real-time.
- 🧩 **No Bloat** — Clean UI, focused features. Each tool does exactly what it says.
- 🌐 **Always Accessible** — No account, no paywall, no rate limits.

---

## 🗺️ Roadmap

- [x] 9 core developer tools
- [ ] More tools coming soon
- [ ] Public API access for each tool (so developers can integrate them directly)

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ by a developer, for developers.</p>
</div>
