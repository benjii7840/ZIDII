# Zidi — AI-Powered Business Finance Platform

Zidi is a full-stack SaaS application that helps small businesses in Kenya manage their finances. Create and send professional invoices, track expenses, visualize financial performance, and get AI-powered insights about your business.

## 🌐 Live Demo
- **Frontend:** https://ziddi.netlify.app
- **Backend API:** https://zidii.onrender.com

## ✨ Features

- **Authentication** — Secure JWT-based register and login system
- **Invoice Management** — Create, send, and track invoices with status updates (Draft → Sent → Paid)
- **PDF Generation** — Download professional PDF invoices instantly
- **Expense Tracking** — Log and categorize business expenses
- **Financial Dashboard** — Real-time stats including revenue, expenses, profit and outstanding invoices
- **AI Assistant** — Ask questions about your finances powered by OpenAI

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- PDFKit
- OpenAI API

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- OpenAI API key

### Backend Setup
```bash
cd BACKEND
npm install
```

Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5002
OPENAI_API_KEY=your_openai_key
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd FRONTEND
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5002
```
```bash
npm run dev
```

## 📡 API Endpoints

### Auth
```
POST /api/auth/register   — Create new account
POST /api/auth/login      — Login to account
GET  /api/auth/me         — Get current user
```

### Invoices
```
GET    /api/invoices          — Get all invoices
POST   /api/invoices          — Create invoice
PUT    /api/invoices/:id      — Update invoice
DELETE /api/invoices/:id      — Delete invoice
GET    /api/invoices/:id/pdf  — Download PDF
```

### Expenses
```
GET    /api/expenses       — Get all expenses
POST   /api/expenses       — Add expense
DELETE /api/expenses/:id   — Delete expense
```

### Dashboard
```
GET /api/dashboard   — Get financial stats
```

### AI Assistant
```
POST /api/ai/chat   — Chat with AI assistant
```

## 📸 Screenshots

![Dashboard](add-screenshot-here)
![Invoices](add-screenshot-here)
![AI Assistant](add-screenshot-here)

## 👨‍💻 Author

**Benjamin Baraza**
- GitHub: [@benjii7840](https://github.com/benjii7840)
- Portfolio: https://benjamin-baraza.netlify.app
- LinkedIn: www.linkedin.com/in/benjamin-baraza



## 📄 License

MIT
```

---

**To add it:**

1. Create `README.md` in the root of your `ZIDII` folder
2. Paste this content
3. Replace the screenshot placeholders with actual screenshots
4. Push to GitHub:
```
git add .
git commit -m "add README"
git push
