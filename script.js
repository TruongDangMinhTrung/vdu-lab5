// Danh sách sản phẩm (giá mang tính minh họa, bạn tự sửa)
const products = [
  { id: 1, brand: "Apple",   name: "iPhone 15 128GB",       spec: "Chip A16 · Màn 6.1\" OLED · Camera 48MP", price: 17990000, c1: "#14213d", c2: "#6b7fa8" },
  { id: 2, brand: "Apple",   name: "iPhone 16 Pro 256GB",   spec: "Chip A18 Pro · Màn 6.3\" 120Hz · Titan",   price: 28990000, c1: "#8a7f72", c2: "#d9cfc1" },
  { id: 3, brand: "Samsung", name: "Galaxy S25 256GB",      spec: "Snapdragon 8 Elite · 6.2\" · Camera 50MP", price: 22490000, c1: "#2b50ff", c2: "#9fb3ff" },
  { id: 4, brand: "Samsung", name: "Galaxy A55 5G 128GB",   spec: "Exynos 1480 · 6.6\" AMOLED · Pin 5000mAh", price: 8990000,  c1: "#3b8f7a", c2: "#a8e0cf" },
  { id: 5, brand: "Xiaomi",  name: "Redmi Note 13 Pro",     spec: "Camera 200MP · Màn 120Hz · Sạc 67W",       price: 7290000,  c1: "#7a3bd1", c2: "#d4b3ff" },
  { id: 6, brand: "Xiaomi",  name: "Xiaomi 14T 256GB",      spec: "Dimensity 8300 · Leica · Sạc 67W",          price: 11490000, c1: "#c4551f", c2: "#ffc9a3" },
  { id: 7, brand: "OPPO",    name: "OPPO Reno12 5G 256GB",  spec: "Dimensity 7300 · Camera chân dung 50MP",    price: 10990000, c1: "#d14a8b", c2: "#ffc2dd" },
  { id: 8, brand: "OPPO",    name: "OPPO A60 128GB",        spec: "Màn 90Hz · Pin 5000mAh · Sạc 45W",          price: 4990000,  c1: "#1f7ac4", c2: "#a9d5ff" }
];

const fmt = n => n.toLocaleString("vi-VN") + " ₫";
const $ = id => document.getElementById(id);
let cart = {}; // { id: soLuong }

/* ---------- Hiển thị sản phẩm ---------- */
function renderProducts(brand = "all") {
  const list = brand === "all" ? products : products.filter(p => p.brand === brand);
  $("productGrid").innerHTML = list.map(p => `
    <article class="card">
      <div class="art">
        <div class="phone" style="--c1:${p.c1};--c2:${p.c2}"><div class="screen"></div></div>
      </div>
      <span class="brand">${p.brand}</span>
      <h3>${p.name}</h3>
      <p class="spec">${p.spec}</p>
      <p class="price">${fmt(p.price)}</p>
      <button class="btn" data-add="${p.id}">Thêm vào giỏ</button>
    </article>
  `).join("");
}

$("filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderProducts(chip.dataset.brand);
});

$("productGrid").addEventListener("click", e => {
  const id = e.target.dataset.add;
  if (!id) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
});

/* ---------- Giỏ hàng ---------- */
function renderCart() {
  const ids = Object.keys(cart);
  const count = ids.reduce((s, id) => s + cart[id], 0);
  const total = ids.reduce((s, id) => s + cart[id] * products.find(p => p.id == id).price, 0);

  $("cartCount").textContent = count;
  $("cartTotal").textContent = fmt(total);
  $("cartList").innerHTML = ids.length
    ? ids.map(id => {
        const p = products.find(x => x.id == id);
        return `<li>
          <div>
            <strong>${p.name}</strong>
            <div class="qty">
              <button data-dec="${id}" aria-label="Giảm">−</button>
              <span>${cart[id]}</span>
              <button data-inc="${id}" aria-label="Tăng">+</button>
            </div>
          </div>
          <span>${fmt(p.price * cart[id])}</span>
        </li>`;
      }).join("")
    : `<li class="empty">Giỏ hàng đang trống. Chọn một chiếc điện thoại để bắt đầu.</li>`;
}

$("cartList").addEventListener("click", e => {
  const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
  if (inc) cart[inc]++;
  if (dec && --cart[dec] <= 0) delete cart[dec];
  if (inc || dec) renderCart();
});

function openCart()  { $("drawer").classList.add("open");    $("overlay").classList.add("show");    $("drawer").setAttribute("aria-hidden", "false"); }
function closeCart() { $("drawer").classList.remove("open"); $("overlay").classList.remove("show"); $("drawer").setAttribute("aria-hidden", "true"); }

$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

$("checkout").addEventListener("click", () => {
  if (!Object.keys(cart).length) return alert("Giỏ hàng đang trống.");
  alert("Đặt hàng thành công! Chúng tôi sẽ gọi xác nhận trong 15 phút.");
  cart = {};
  renderCart();
  closeCart();
});

renderProducts();
renderCart();
