# MindBrief - Intelligent Web Summarizer

MindBrief is a powerful, full-stack AI research assistant that helps you discover, read, and summarize content from the web. It uses advanced web scraping and Google's Gemini AI to transform scattered web articles into comprehensive, well-structured research summaries.

![MindBrief Dashboard](https://placehold.co/1200x600/6366f1/ffffff?text=MindBrief+Dashboard)

## 🚀 Key Features

-   **Deep Web Search**: Integrated DuckDuckGo search to find relevant articles on any topic.
-   **Smart Content Extraction**: Uses **Mozilla Readability** engine (same as Firefox Reader View) to accurately extracting article text, filtering out ads, navbars, and clutter.
-   **AI-Powered Summarization**: Leveraging Google Gemini 2.5 Flash to synthesize multiple sources into a single, cohesive research document.
-   **Personal Vault**: Save your summaries for later access (supports in-memory or Firebase Firestore storage).
-   **Export Options**: Download your research as Markdown (`.md`) or Text (`.txt`) files.
-   **Modern UI**: Built with Next.js 14, Tailwind CSS, and Framer Motion for a smooth, responsive experience.

## 🛠️ Technology Stack

### Frontend
-   **Core**: Next.js 14.2 (App Router), React 18.3, JavaScript (JSX)
-   **UI & Styling**: Tailwind CSS, Shadcn UI (`@radix-ui`), Framer Motion (Animations), Lucide React (Icons), `clsx` & `tailwind-merge`
-   **State & Networking**: TanStack Query (`@tanstack/react-query`), React Hook Form
-   **Package Manager**: `pnpm`

### Backend
-   **Runtime**: Node.js, Express.js
-   **AI**: Google Gemini API (`@google/generative-ai` - using `gemini-2.5-flash`)
-   **Scraping & Processing**: `axios`, `cheerio` (HTML Cleaning), `@mozilla/readability` (Content Extraction), `jsdom`
-   **Validation & Security**: `joi` (Validation), `helmet` (Security), `cors`
-   **Database**: Firebase Admin SDK (Firestore) / In-Memory Storage


## 📋 Prerequisites

-   Node.js 18.0.0 or higher
-   pnpm (Preferred Package Manager)
-   A Google Gemini API Key (Free tier available at [Google AI Studio](https://makersuite.google.com/app/apikey))

## 📦 Installation & Setup

You need to set up both the **Frontend** and **Backend** separately.

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=5001
    FRONTEND_URL=http://localhost:3000
    GEMINI_API_KEY=your_gemini_api_key_here
    # Optional: FIREBASE_SERVICE_ACCOUNT=... (see Firebase section)
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure Environment Variables:
    Create a `.env.local` file in the `frontend` directory:
    ```env
    # Explicitly point to IPv4 to avoid localhost resolution issues
    NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
    
    # Firebase Config (Required only for Auth/Vault)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
    # ... other firebase config
    ```

## 🚀 Running the Application

You need to run **two separate terminals** simultaneously.

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```
*Runs on [http://localhost:5000](http://localhost:5000)*

**Terminal 2: Frontend**
```bash
cd frontend
pnpm dev
```
*Runs on [http://localhost:3000](http://localhost:3000)*

> **Note:** If port 3000 is busy, Next.js will automatically use port 3001. The backend is configured to accept connections from both.

## 🧠 How It Works

1.  **Search**: You enter a topic. The backend scrapes DuckDuckGo for relevant links.
2.  **Scrape**: When you select links, the backend fetches the pages. It uses `cheerio` to clean DOM elements (scripts, ads) and then passes the HTML to `@mozilla/readability` to extract the main article content.
3.  **Summarize**: The extracted text from all selected sources is combined and sent to Google Gemini with a prompt to generate a structured, comprehensive summary.
4.  **Save**: The result is sent back to the frontend where you can read, save to your vault, or download.

## ⚠️ Troubleshooting

**"Cannot connect to backend server"**
-   Ensure the backend is running on port 5000.
-   Check your `NEXT_PUBLIC_API_URL` in `frontend/.env.local`. Try setting it to `http://127.0.0.1:5000` instead of `localhost`.

**"Port 5000 already in use"**
-   Kill the process using the port:
    -   **Windows**: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
    -   **Mac/Linux**: `lsof -i :5000` then `kill -9 <PID>`

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---
Built by [Kaif Khan](https://github.com/Kaifkhan1212)
