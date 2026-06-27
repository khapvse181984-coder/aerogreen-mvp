function chooseProduct(productName) {
  localStorage.setItem("selectedProduct", productName);
  window.location.href = "contact.html";
}

// API base URL — change this to your backend server address
const API_BASE = "http://localhost:3000/api";

async function submitForm() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const areaInstall = document.getElementById("areaInstall").value;
  const budgetContact = document.getElementById("budgetContact").value;
  const note = document.getElementById("note").value;

  // Lấy thêm các field từ form (nếu có)
  const houseType = document.getElementById("houseType")
    ? document.getElementById("houseType").value
    : "";
  const area = document.getElementById("area")
    ? document.getElementById("area").value
    : "";
  const budget = document.getElementById("budget")
    ? document.getElementById("budget").value
    : "";
  const goal = document.getElementById("goal")
    ? document.getElementById("goal").value
    : "";

  if (name.trim() === "" || phone.trim() === "") {
    alert("Vui lòng nhập họ tên và số điện thoại.");
    return;
  }

  try {
    const response = await fetch(API_BASE + "/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        house_type: houseType,
        area: area || areaInstall,
        budget: budget || budgetContact,
        goal,
        note,
      }),
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById("success").innerText = result.message;

      // Clear form
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      if (document.getElementById("areaInstall"))
        document.getElementById("areaInstall").value = "";
      if (document.getElementById("budgetContact"))
        document.getElementById("budgetContact").value = "";
      document.getElementById("note").value = "";
    } else {
      alert("Lỗi: " + (result.error || "Không thể gửi thông tin."));
    }
  } catch (err) {
    alert(
      "Không thể kết nối đến server. Vui lòng đảm bảo backend đang chạy tại " +
        API_BASE
    );
  }
}

window.onload = function () {
  const selectedProduct = localStorage.getItem("selectedProduct");

  if (selectedProduct && document.getElementById("note")) {
    document.getElementById("note").value =
      "Tôi muốn được tư vấn gói " + selectedProduct;
  }
};
function showAdvice() {
  const houseType = document.getElementById("houseType").value;
  const area = document.getElementById("area").value;
  const budget = document.getElementById("budget").value;

  let product = "";
  let reason = "";
  let price = "";

  if (houseType === "chungcu" || area === "small" || budget === "low") {
    product = "AeroGreen Mini";
    price = "5.990.000đ";
    reason = "Phù hợp với chung cư, ban công nhỏ và khách hàng muốn bắt đầu trải nghiệm khí canh với chi phí vừa phải.";
  } else if (area === "medium" || budget === "mid") {
    product = "AeroGreen Standard";
    price = "8.490.000đ";
    reason = "Phù hợp với nhà phố hoặc căn hộ có ban công vừa, đáp ứng tốt nhu cầu trải nghiệm sống xanh cho gia đình.";
  } else {
    product = "AeroGreen Family";
    price = "12.990.000đ";
    reason = "Phù hợp với sân thượng hoặc không gian lớn, dành cho khách hàng muốn đầu tư một khu vườn khí canh tại nhà.";
  }

  const result = document.getElementById("adviceResult");

  result.innerHTML = `
    <h3>Gợi ý phù hợp: ${product}</h3>
    <p><b>Giá dự kiến:</b> ${price}</p>
    <p><b>Lý do đề xuất:</b> ${reason}</p>
    <p><b>Vai trò của AeroGreen Hub:</b> Tư vấn và kết nối khách hàng với nhà cung cấp phù hợp.</p>
    <button onclick="chooseProduct('${product}')">Đăng ký tư vấn gói này</button>
  `;

  result.style.display = "block";
}