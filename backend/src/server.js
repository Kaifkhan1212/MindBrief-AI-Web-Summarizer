const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const summarizeRoutes = require("./routes/summarize");
const vaultRoutes = require("./routes/vault");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL,
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://127.0.0.1:3000",
//       "http://127.0.0.1:3001",
//     ].filter(Boolean),
//     credentials: true,
//   })
// );
app.use(cors());


// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/summarize", summarizeRoutes);
app.use("/api/vault", vaultRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root endpoint - helpful info
app.get("/", (req, res) => {
  res.json({
    message: "AI Summarizer API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      search: "POST /api/search",
      summarize: "POST /api/summarize",
      vault: "GET/POST/DELETE /api/vault/:userId",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
