const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { getDatabase } = require("./database");

// Init DB
getDatabase();
try {
  const db = getDatabase();
  const count = db.prepare("SELECT COUNT(*) as cnt FROM products").get();
  if (count.cnt === 0) {
    console.log("🌱 Seeding products...");
    require("./seed");
  }
} catch (e) {
  console.log("⚠️ Seed check skipped:", e.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve admin dashboard as static files
app.use("/admin", express.static(path.join(__dirname, "admin")));

// API Routes
app.use("/api/contact", require("./routes/contacts"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/products", require("./routes/products"));
app.use("/api/recommend", require("./routes/recommend"));
app.use("/api/stats", require("./routes/stats"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Admin fallback (SPA-like)
app.get("/admin*", (req, res) => {
  const adminPath = path.join(__dirname, "admin", "index.html");
  if (fs.existsSync(adminPath)) {
    res.sendFile(adminPath);
  } else {
    res.status(404).json({ error: "Admin dashboard not found" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔══════════════════════════════════════════╗
║        🌿 AeroGreen Hub Server          ║
║──────────────────────────────────────────║
║  URL:   http://localhost:${PORT}          ║
║  Admin: http://localhost:${PORT}/admin    ║
║  API:   http://localhost:${PORT}/api      ║
╚══════════════════════════════════════════╝
  `);
});
