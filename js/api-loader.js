/**
 * AeroGreen Hub — API Loader
 * Tự động tải dữ liệu từ backend nếu server đang chạy,
 * fallback về dữ liệu tĩnh nếu không kết nối được.
 */

const API_BASE = "http://localhost:3000/api";

/**
 * Kiểm tra backend có đang chạy không
 */
async function checkBackend() {
  try {
    const res = await fetch(API_BASE + "/health", {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Tải danh sách sản phẩm từ API
 * Nếu không kết nối được, giữ nguyên dữ liệu tĩnh trong HTML
 */
async function loadProductsFromAPI() {
  try {
    const res = await fetch(API_BASE + "/products", {
      signal: AbortSignal.timeout(3000),
    });
    const result = await res.json();
    return result.data;
  } catch {
    return null;
  }
}

/**
 * Gửi yêu cầu tư vấn lên backend
 */
async function submitContact(data) {
  const res = await fetch(API_BASE + "/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

/**
 * Lấy gợi ý sản phẩm từ backend
 */
async function getRecommendation(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(API_BASE + "/recommend?" + query, {
    signal: AbortSignal.timeout(3000),
  });
  return await res.json();
}

// Export for use in other scripts
window.AeroGreenAPI = {
  checkBackend,
  loadProductsFromAPI,
  submitContact,
  getRecommendation,
};
