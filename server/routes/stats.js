const express = require("express");
const router = express.Router();
const { getDatabase } = require("../database");

// GET /api/stats — Dashboard statistics
router.get("/", (req, res) => {
  try {
    const db = getDatabase();

    const totalContacts = db
      .prepare("SELECT COUNT(*) as value FROM contacts")
      .get();
    const pending = db
      .prepare("SELECT COUNT(*) as value FROM contacts WHERE status = 'pending'")
      .get();
    const contacted = db
      .prepare(
        "SELECT COUNT(*) as value FROM contacts WHERE status = 'contacted'"
      )
      .get();
    const installed = db
      .prepare(
        "SELECT COUNT(*) as value FROM contacts WHERE status = 'installed'"
      )
      .get();

    const byHouseType = db
      .prepare(
        `SELECT COALESCE(NULLIF(house_type, ''), 'Khác') as label, COUNT(*) as value 
         FROM contacts GROUP BY house_type ORDER BY value DESC`
      )
      .all();

    const byStatus = db
      .prepare(
        `SELECT 
          CASE status 
            WHEN 'pending' THEN 'Chưa gọi' 
            WHEN 'contacted' THEN 'Đã tư vấn' 
            WHEN 'installed' THEN 'Đã lắp đặt' 
            WHEN 'closed' THEN 'Đã đóng' 
          END as label, 
          COUNT(*) as value 
         FROM contacts GROUP BY status ORDER BY value DESC`
      )
      .all();

    const recentContacts = db
      .prepare(
        "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5"
      )
      .all();

    res.json({
      totalContacts: totalContacts.value,
      pending: pending.value,
      contacted: contacted.value,
      installed: installed.value,
      byHouseType,
      byStatus,
      recentContacts,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    res.status(500).json({ error: "Lỗi server." });
  }
});

module.exports = router;
