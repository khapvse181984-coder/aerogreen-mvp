const { getDatabase } = require("./database");

const db = getDatabase();

// Check if products already seeded
const count = db.prepare("SELECT COUNT(*) as cnt FROM products").get();
if (count.cnt > 0) {
  console.log("✅ Database already has products. Skipping seed.");
  process.exit(0);
}

const products = [
  {
    name: "Mini Kit",
    description:
      "Lý tưởng cho căn hộ và ban công nhỏ. Tự trồng rau thơm và rau ăn lá với diện tích tối thiểu.",
    holes: 20,
    suitable_for: "Ban công / Căn hộ nhỏ",
    size: "40cm x 40cm x 120cm",
    price: 5990000,
    price_label: "5.990.000₫",
    image: "../images/tower.png",
    features: JSON.stringify([
      "20 lỗ trồng",
      "Phù hợp ban công nhỏ",
      "Dễ lắp đặt",
      "Bảo trì tối thiểu",
    ]),
  },
  {
    name: "Family Kit",
    description:
      "Mẫu bán chạy nhất. Đủ sản lượng cung cấp rau sạch cho cả gia đình mỗi ngày.",
    holes: 40,
    suitable_for: "Gia đình 4–6 người",
    size: "60cm x 60cm x 160cm",
    price: 8490000,
    price_label: "8.490.000₫",
    image: "../images/Family Kit.png",
    features: JSON.stringify([
      "40 lỗ trồng",
      "Phù hợp gia đình 4-6 người",
      "Sản lượng cao",
      "Thiết kế chắc chắn",
    ]),
  },
  {
    name: "Rooftop Kit",
    description:
      "Năng suất tối đa cho những ai muốn xây dựng vườn rau đô thị thực sự trên sân thượng.",
    holes: 80,
    suitable_for: "Sân thượng / Diện tích lớn",
    size: "100cm x 100cm x 180cm",
    price: 12990000,
    price_label: "12.990.000₫",
    image: "../images/Rooftop Kit.png",
    features: JSON.stringify([
      "80 lỗ trồng",
      "Phù hợp sân thượng",
      "Năng suất tối đa",
      "Hệ thống tưới tự động",
    ]),
  },
];

const insert = db.prepare(`
  INSERT INTO products (name, description, holes, suitable_for, size, price, price_label, image, features)
  VALUES (@name, @description, @holes, @suitable_for, @size, @price, @price_label, @image, @features)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insert.run(item);
  }
});

insertMany(products);
console.log("✅ Seeded", products.length, "products successfully.");
process.exit(0);
