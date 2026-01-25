🧠 MindBrief AI Summarizer

A modern full-stack web application that allows users to search the web for any topic, scrape content from multiple websites, and generate comprehensive AI-powered summaries using the Google Gemini API.
All summaries can be saved in a personal Vault and downloaded in multiple formats.

🔗 GitHub Repository:
https://github.com/Kaifkhan1212/MindBrief-MindBrief-01

🎯 What is MindBrief?

MindBrief is an AI-powered research assistant that helps you quickly understand complex topics by:

Searching the web for relevant sources

Extracting and cleaning content from multiple websites

Generating comprehensive summaries using Google Gemini AI

Organizing research in a personal vault

Exporting summaries for offline use

🚀 Features

Web Search: Search any topic and discover relevant websites

Content Scraping: Extract content from multiple websites with intelligent parsing

AI Summarization: Generate single-page summaries from scraped content

Download Summaries: Download as TXT or Markdown

Vault Storage: Save and manage summaries in a personal vault

Firebase Authentication: Secure user authentication and data storage

Modern UI: Responsive interface with smooth animations

🛠️ Technology Stack
Frontend

Next.js (App Router)

React

JavaScript (JSX)

Tailwind CSS

Shadcn UI / Radix UI

Framer Motion

Lucide React

TanStack Query

React Hook Form

Backend

Node.js

Express.js

Google Gemini API (@google/generative-ai)

Axios

Cheerio

jsdom

@mozilla/readability

Joi

Helmet

CORS

Database

Firebase Firestore (optional)

In-Memory Storage (default)

📋 Prerequisites

Node.js 18 or higher

npm or pnpm

Google Gemini API Key

🛠️ Quick Start
1. Install Dependencies

Backend

cd backend
npm install


Frontend

cd frontend
npm install

2. Start the Servers

Run two servers simultaneously.

Terminal 1 (Backend)

cd backend
npm run dev


Terminal 2 (Frontend)

cd frontend
npm run dev

3. Access the Application

Open your browser:

http://localhost:3000

📖 How to Use

Enter a topic and click Search

Select links from the sidebar

Click Generate Summary

Download as TXT or Markdown

Save to Vault for later use

⚙️ Configuration
Backend Environment Variables

Create .env in backend:

GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000

Frontend Environment Variables

Create .env.local in frontend:

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

Firebase Admin (Optional – Persistent Vault)

Add one of the following to backend/.env:

FIREBASE_SERVICE_ACCOUNT={...service-account-json...}


OR

FIREBASE_PROJECT_ID=your-project-id


OR

GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json


Without Firebase Admin, vault uses in-memory storage.

🌟 API Endpoints
Method	Endpoint	Description
GET	/api/health	Health check
POST	/api/search	Search topic
POST	/api/summarize	Generate summary
GET	/api/vault/:userId	Get vault items
POST	/api/vault/:userId	Save to vault
DELETE	/api/vault/:userId/:itemId	Delete item
📁 Project Structure
MindBrief-AI_Summarizer/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── search.js
│   │   ├── summarize.js
│   │   └── vault.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── page.jsx
│   ├── components/
│   │   ├── vault.jsx
│   │   ├── auth-guard.jsx
│   │   └── ui/
│   ├── lib/
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── auth-context.jsx
│   ├── package.json
│   └── .env.local
├── README.md
└── workflow.txt

🔍 How It Works

Search topic using DuckDuckGo

Scrape selected URLs

Clean and extract content

Send to Gemini AI

Display, save, or download summary

🛡️ Security Features

Rate limiting

Helmet.js

CORS protection

Firebase Authentication

Input validation

🚀 Deployment
Backend
npm install
npm start

Frontend
npm run build
npm start


Recommended Platforms

Vercel (Frontend)

Render / Railway (Backend)

Firebase Hosting

📝 Notes

Backend must be running before frontend

Vault uses in-memory storage by default

Gemini API improves summary quality

Scraping is server-side only

See workflow.txt for full workflow

🤝 Contributing

Contributions are welcome.
Feel free to submit a Pull Request.

📄 License

MIT License. See LICENSE
 for details.

👨‍💻 Author

Kaif Khan
GitHub: https://github.com/Kaifkhan1212
