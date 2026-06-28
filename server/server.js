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

// API root — welcome message
app.get("/api", (req, res) => {
  res.json({
    name: "AeroGreen Hub API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      contact: "POST /api/contact",
      contacts: "GET /api/contacts",
      contactDetail: "PATCH /api/contacts/:id",
      products: "GET /api/products",
      productDetail: "GET /api/products/:id",
      compare: "GET /api/products/compare?ids=1,2",
      recommend: "GET /api/recommend?house_type=&area=&budget=",
      stats: "GET /api/stats",
    },
    admin: "/admin",
  });
});

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

// Root — redirect to admin
app.get("/", (req, res) => {
  res.redirect("/admin");
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
