const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "aerogreen.db");

let db;

function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      house_type TEXT DEFAULT '',
      area TEXT DEFAULT '',
      budget TEXT DEFAULT '',
      goal TEXT DEFAULT '',
      note TEXT DEFAULT '',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','contacted','installed','closed')),
      created_at DATETIME DEFAULT (datetime('now', '+7 hours'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      holes INTEGER DEFAULT 0,
      suitable_for TEXT DEFAULT '',
      size TEXT DEFAULT '',
      price INTEGER DEFAULT 0,
      price_label TEXT DEFAULT '',
      image TEXT DEFAULT '',
      features TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT (datetime('now', '+7 hours'))
    );
  `);
}

module.exports = { getDatabase };
