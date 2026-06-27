// ===== Configuration =====
const API_BASE = "http://localhost:3000/api";
let currentPage = 1;

// ===== Utility =====
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  if (!amount) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

const STATUS_MAP = {
  pending: "Chưa gọi",
  contacted: "Đã tư vấn",
  installed: "Đã lắp đặt",
  closed: "Đã đóng",
};

// ===== Navigation =====
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const tab = item.dataset.tab;

    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");

    document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
    document.getElementById(`tab-${tab}`).classList.add("active");

    document.getElementById("page-title").textContent =
      tab === "dashboard" ? "Dashboard" : tab === "contacts" ? "Yêu cầu tư vấn" : "Sản phẩm";

    if (tab === "dashboard") loadDashboard();
    if (tab === "contacts") loadContacts();
    if (tab === "products") loadProducts();
  });
});

// ===== Dashboard =====
async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();

    document.getElementById("stat-total").textContent = data.totalContacts;
    document.getElementById("stat-pending").textContent = data.pending;
    document.getElementById("stat-contacted").textContent = data.contacted;
    document.getElementById("stat-installed").textContent = data.installed;

    renderSimpleChart("house-type-chart", data.byHouseType, "Loại nhà");
    renderSimpleChart("status-chart", data.byStatus, "Trạng thái");

    renderRecentContacts(data.recentContacts);
  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

function renderSimpleChart(containerId, items, label) {
  const container = document.getElementById(containerId);
  if (!items || items.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:40px;">Chưa có dữ liệu</p>';
    return;
  }

  const total = items.reduce((sum, i) => sum + i.value, 0);
  const colors = ["#155c2e", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

  let html = '<div style="display:flex;flex-direction:column;gap:12px;">';
  items.forEach((item, idx) => {
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    const color = colors[idx % colors.length];
    html += `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
          <span style="font-weight:500;">${item.label || "Khác"}</span>
          <span style="font-weight:600;">${item.value} (${pct}%)</span>
        </div>
        <div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width 0.5s;"></div>
        </div>
      </div>
    `;
  });
  html += "</div>";
  container.innerHTML = html;
}

function renderRecentContacts(contacts) {
  const container = document.getElementById("recent-contacts");
  if (!contacts || contacts.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:20px;">Chưa có yêu cầu nào</p>';
    return;
  }

  let html = "";
  contacts.forEach((c) => {
    html += `
      <div class="recent-item">
        <div>
          <div class="recent-name">${c.name}</div>
          <div style="font-size:12px;color:#64748b;">${c.phone} · ${formatDate(c.created_at)}</div>
        </div>
        <span class="status-badge status-${c.status}">${STATUS_MAP[c.status] || c.status}</span>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ===== Contacts =====
async function loadContacts(page = 1) {
  currentPage = page;
  const status = document.getElementById("filter-status").value;
  const search = document.getElementById("search-input").value.trim();

  let url = `${API_BASE}/contacts?page=${page}&limit=20`;
  if (status) url += `&status=${status}`;

  try {
    const res = await fetch(url);
    const result = await res.json();
    renderContactsTable(result.data, result.pagination);
  } catch (err) {
    console.error("Load contacts error:", err);
  }
}

function renderContactsTable(contacts, pagination) {
  const tbody = document.getElementById("contacts-table-body");

  if (!contacts || contacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="loading">Không có yêu cầu nào</td></tr>';
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  let html = "";
  const offset = (pagination.page - 1) * pagination.limit;

  contacts.forEach((c, idx) => {
    html += `
      <tr>
        <td>${offset + idx + 1}</td>
        <td><strong>${c.name}</strong></td>
        <td>${c.phone}</td>
        <td>${c.house_type || "-"}</td>
        <td>${c.area || "-"}</td>
        <td>${c.budget || "-"}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${c.note || ""}">${c.note || "-"}</td>
        <td style="white-space:nowrap;font-size:12px;">${formatDate(c.created_at)}</td>
        <td>
          <select class="status-select" onchange="updateStatus(${c.id}, this.value)">
            <option value="pending" ${c.status === "pending" ? "selected" : ""}>Chưa gọi</option>
            <option value="contacted" ${c.status === "contacted" ? "selected" : ""}>Đã tư vấn</option>
            <option value="installed" ${c.status === "installed" ? "selected" : ""}>Đã lắp đặt</option>
            <option value="closed" ${c.status === "closed" ? "selected" : ""}>Đã đóng</option>
          </select>
        </td>
        <td>
          <button class="page-btn" style="padding:4px 10px;font-size:12px;color:#ef4444;border-color:#fecaca;" onclick="deleteContact(${c.id})">Xóa</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  renderPagination(pagination);
}

function renderPagination(pagination) {
  const container = document.getElementById("pagination");
  if (pagination.totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= pagination.totalPages; i++) {
    html += `<button class="page-btn ${i === pagination.page ? "active" : ""}" onclick="loadContacts(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (result.success) {
      loadContacts(currentPage);
      loadDashboard();
    } else {
      alert("Lỗi: " + result.error);
    }
  } catch (err) {
    alert("Lỗi kết nối server.");
  }
}

async function deleteContact(id) {
  if (!confirm("Bạn có chắc muốn xóa yêu cầu này?")) return;

  try {
    const res = await fetch(`${API_BASE}/contacts/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) {
      loadContacts(currentPage);
      loadDashboard();
    } else {
      alert("Lỗi: " + result.error);
    }
  } catch (err) {
    alert("Lỗi kết nối server.");
  }
}

// ===== Products =====
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const result = await res.json();
    renderProducts(result.data);
  } catch (err) {
    console.error("Load products error:", err);
  }
}

function renderProducts(products) {
  const container = document.getElementById("products-list");

  if (!products || products.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8;">Chưa có sản phẩm</p>';
    return;
  }

  let html = '<div class="product-grid">';
  products.forEach((p) => {
    const features = JSON.parse(p.features || "[]");
    html += `
      <div class="product-card">
        <h4>${p.name}</h4>
        <div class="price">${p.price_label || formatCurrency(p.price)}</div>
        <p style="font-size:13px;color:#475569;margin-bottom:12px;">${p.description}</p>
        <div class="info-row">
          <span class="info-label">Số lỗ trồng</span>
          <span>${p.holes} lỗ</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phù hợp</span>
          <span>${p.suitable_for}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Kích thước</span>
          <span>${p.size}</span>
        </div>
        ${features.map(f => `
          <div class="info-row">
            <span class="info-label">✓</span>
            <span>${f}</span>
          </div>
        `).join('')}
      </div>
    `;
  });
  html += "</div>";
  container.innerHTML = html;
}

// ===== Clock =====
function updateClock() {
  const now = new Date();
  document.getElementById("current-time").textContent = now.toLocaleString("vi-VN");
}
setInterval(updateClock, 1000);
updateClock();

// ===== Init =====
loadDashboard();
