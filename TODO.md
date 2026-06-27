# 📋 AeroGreen Hub — Backend Development TODO List

> Dựa trên tài liệu *AeroGreenHub_Summary.md* và yêu cầu MVP Checkpoint 3

---

## ✅ Priority 1 — Chức năng cốt lõi (Bắt buộc)

### 1. Khởi tạo Backend Project
- [x] Tạo `server/package.json` với Express, SQLite, CORS
- [x] Tạo file `server/server.js` — entry point, khởi động server port 3000
- [x] Cấu hình CORS để frontend (port 5500 / live-server) gọi API

### 2. Database (SQLite)
- [x] Tạo file `server/database.js` — kết nối & khởi tạo database
- [x] Bảng **contacts**: id, name, phone, house_type, area, budget, goal, note, status, created_at
- [x] Bảng **products**: id, name, description, holes, suitable_for, size, price, image, created_at
- [x] Seed dữ liệu mẫu cho products (Mini Kit, Family Kit, Rooftop Kit)

### 3. API — Lưu đăng ký tư vấn
- [x] **POST /api/contact** — Nhận dữ liệu từ form contact → lưu vào DB → trả về thành công
- [x] Các field: Họ tên, SĐT, Loại nhà, Diện tích, Ngân sách, Mục tiêu, Ghi chú

### 4. API — Quản lý yêu cầu tư vấn (Admin)
- [x] **GET /api/contacts** — Lấy danh sách tất cả contacts (có phân trang, lọc theo status)
- [x] **PATCH /api/contacts/:id** — Cập nhật trạng thái (chưa gọi → đã tư vấn → đã lắp đặt)
- [x] **DELETE /api/contacts/:id** — Xóa yêu cầu

### 5. API — Quản lý sản phẩm
- [x] **GET /api/products** — Lấy danh sách sản phẩm
- [x] **GET /api/products/:id** — Lấy chi tiết một sản phẩm

### 6. Admin Dashboard (Giao diện quản lý)
- [x] Tạo trang `server/admin/index.html` — Dashboard + Contacts + Products
- [x] Bảng hiển thị: STT, Họ tên, SĐT, Loại nhà, Diện tích, Ngân sách, Trạng thái, Ngày đăng ký
- [x] Dropdown cập nhật trạng thái (Chưa gọi / Đã tư vấn / Đã lắp đặt / Đã đóng)
- [x] Thống kê nhanh: Tổng contacts, Chưa gọi, Đã tư vấn, Đã lắp đặt
- [x] Biểu đồ phân bố loại nhà & trạng thái

---

## ✅ Priority 2 — Nâng cao (Đã hoàn thành)

### 7. API — Gợi ý sản phẩm
- [x] **GET /api/recommend?house_type=...&area=...&budget=...** — Gợi ý sản phẩm phù hợp
- [x] Logic gợi ý dựa trên: loại nhà (chung cư/nhà phố), diện tích (nhỏ/vừa/lớn), ngân sách (thấp/trung bình/cao)

### 8. API — So sánh sản phẩm
- [x] **GET /api/products/compare?ids=1,2,3** — So sánh nhiều sản phẩm
- [x] Trả về danh sách sản phẩm để frontend so sánh

### 9. API — Dashboard thống kê
- [x] **GET /api/stats** — Thống kê tổng quan
- [x] Số lượng contacts theo loại nhà, theo trạng thái

### 10. Cập nhật Frontend
- [x] Sửa `contact.html` + `js/script.js` — Gọi API POST /api/contact thay vì chỉ log console
- [x] Sửa `products.html` + `js/products-api.js` — Tải sản phẩm từ API nếu backend chạy
- [x] Tạo `js/api-loader.js` — Module dùng chung cho tất cả trang
- [ ] Tích hợp API gợi ý sản phẩm vào `services.html`

---

## 📁 Cấu trúc thư mục (Sau khi tái cấu trúc)

```
aerogreen-mvp/                        # Thư mục gốc dự án
├── index.html                        # Trang chủ
├── about.html                        # Giới thiệu
├── contact.html                      # Liên hệ / Form tư vấn
├── products.html                     # Sản phẩm
├── services.html                     # Dịch vụ
├── TODO.md                           # ✅ Checklist dự án
│
├── css/
│   └── style.css                     # Style chung
│
├── images/                           # Hình ảnh
│
├── js/
│   ├── script.js                     # Script chính (form, advice)
│   ├── api-loader.js                 # Module kết nối backend
│   └── products-api.js               # Tải sản phẩm động từ API
│
└── server/                           # 🚀 Backend API
    ├── package.json
    ├── server.js                     # Entry point
    ├── database.js                   # SQLite setup & schema
    ├── seed.js                       # Seed dữ liệu mẫu
    ├── aerogreen.db                  # Database file (tự động tạo)
    │
    ├── routes/
    │   ├── contacts.js               # POST/GET/PATCH/DELETE contacts
    │   ├── products.js               # GET products, compare
    │   ├── recommend.js              # GET recommend
    │   └── stats.js                  # GET stats
    │
    └── admin/                        # 📊 Admin Dashboard
        ├── index.html
        ├── style.css
        └── script.js
```

---

## 🛠 Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| **Node.js** | Runtime |
| **Express** | Web framework |
| **better-sqlite3** | Database (file-based, không cần cài server) |
| **CORS** | Cho phép frontend gọi API |
| **HTML/CSS/JS** | Admin dashboard |

---

## 🚀 Cách chạy

```bash
# Bước 1: Khởi động server
cd server
npm install          # Chạy lần đầu để cài dependencies
npm start            # Server tại http://localhost:3000

# Bước 2: Mở frontend
# Mở index.html bằng Live Server (VS Code) — port 5500

# Bước 3: Admin Dashboard
# Truy cập http://localhost:3000/admin
```

> ⚡ **API Base URL:** `http://localhost:3000/api`

---

## 📌 API Endpoints Summary

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/contact` | Lưu đăng ký tư vấn |
| `GET` | `/api/contacts` | Danh sách contacts (hỗ trợ `?status=&page=&limit=`) |
| `PATCH` | `/api/contacts/:id` | Cập nhật trạng thái |
| `DELETE` | `/api/contacts/:id` | Xóa contact |
| `GET` | `/api/products` | Danh sách sản phẩm |
| `GET` | `/api/products/:id` | Chi tiết sản phẩm |
| `GET` | `/api/products/compare?ids=1,2,3` | So sánh sản phẩm |
| `GET` | `/api/recommend?house_type=&area=&budget=` | Gợi ý sản phẩm |
| `GET` | `/api/stats` | Thống kê dashboard |
| `GET` | `/api/health` | Health check |
