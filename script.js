// Lấy phần tử
const quantityInput = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease");
const increaseBtn = document.getElementById("increase");
const priceDisplay = document.querySelector(".price");
const addToCartBtn = document.getElementById("add-to-cart");
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
// Get the price text from the HTML element
const priceElement = document.querySelector(".price");
let basePrice = 0;
if (priceElement) {
  // Remove non-digit characters to extract the numeric value
  basePrice = parseFloat(priceElement.textContent.replace(/[^0-9]/g, ''));
}


function updatePrice() {
  if (quantityInput && priceDisplay) {
    let quantity = parseInt(quantityInput.value);
    let totalPrice = quantity * basePrice;
    priceDisplay.textContent = totalPrice.toLocaleString() + " Vnd";
  }
}

if (increaseBtn && quantityInput) {
  increaseBtn.addEventListener("click", function () {
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
    updatePrice();
  });
}

if (decreaseBtn && quantityInput) {
  decreaseBtn.addEventListener("click", function () {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
      quantityInput.value = quantity - 1;
      updatePrice();
    }
  });
}

updatePrice();

// Hàm cập nhật số lượng sản phẩm khác nhau trong giỏ hàng
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const distinctCount = cart.length;
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = distinctCount;
  }
}

// Hàm cập nhật nội dung modal giỏ hàng và tính tổng tiền thanh toán
function updateCartModal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = ""; // Xóa nội dung cũ

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Giỏ hàng của bạn trống!</p>";
  } else {
    cart.forEach(function (product) {
      const item = document.createElement("div");
      item.classList.add("cart-item");
      item.innerHTML = `
          <img src="${product.image}" alt="${product.name}" width="50" height="50" />
          <div style="display: flex; flex-direction: column;">
            <p><strong>${product.name}</strong></p>
            <div class="quantity-control" style="display: flex; align-items: center;">
              <button class="qty-decrease" data-name="${product.name}" style="width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;">-</button>
              <span class="qty-display" style="margin: 0 5px;">${product.quantity}</span>
              <button class="qty-increase" data-name="${product.name}" style="width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;">+</button>
            </div>
            <p>Giá: ${product.totalPrice.toLocaleString()} Vnd</p>
          </div>
          <button class="delete-btn" data-name="${product.name}" style="margin-left: auto; align-self: center;">Xóa</button>
        `;
      // Thêm sự kiện nếu các nút tồn tại
      const deleteBtn = item.querySelector(".delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", function () {
          deleteProduct(product.name);
        });
      }
      const btnDecrease = item.querySelector(".qty-decrease");
      if (btnDecrease) {
        btnDecrease.addEventListener("click", function () {
          changeQuantity(product.name, -1);
        });
      }
      const btnIncrease = item.querySelector(".qty-increase");
      if (btnIncrease) {
        btnIncrease.addEventListener("click", function () {
          changeQuantity(product.name, 1);
        });
      }
      cartItemsContainer.appendChild(item);
    });

    // Tính tổng số tiền cần thanh toán
    const totalPayment = cart.reduce((sum, product) => sum + product.totalPrice, 0);
    const totalDiv = document.createElement("div");
    totalDiv.style.textAlign = "right";
    totalDiv.style.marginTop = "10px";
    totalDiv.innerHTML = `<strong>Tổng tiền thanh toán: ${totalPayment.toLocaleString()} Vnd</strong>`;
    cartItemsContainer.appendChild(totalDiv);
  }
}


// Hàm thay đổi số lượng sản phẩm trong giỏ hàng
function changeQuantity(productName, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex(item => item.name === productName);
  if (productIndex !== -1) {
    let newQuantity = cart[productIndex].quantity + delta;
    if (newQuantity < 1) {
      newQuantity = 1; // Không cho số lượng nhỏ hơn 1
    }
    cart[productIndex].quantity = newQuantity;
    cart[productIndex].totalPrice = cart[productIndex].price * newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartModal();
    updateCartCount();
  }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function deleteProduct(productName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== productName);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartModal();
  updateCartCount();
}

// Gọi hàm cập nhật số lượng khi load trang
updateCartCount();

// Thêm sản phẩm vào giỏ hàng nếu nút tồn tại
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", function () {
    const productName = document.querySelector(".product-info h1").textContent;
    const quantity = parseInt(quantityInput.value);
    const imageSrc = document.querySelector(".product-image").src;

    const product = {
      name: productName,
      price: basePrice,
      quantity: quantity,
      totalPrice: basePrice * quantity,
      image: imageSrc
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(item => item.name === productName);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
      cart[existingProductIndex].totalPrice =
        cart[existingProductIndex].quantity * cart[existingProductIndex].price;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  });
}

// Hiển thị modal giỏ hàng nếu icon tồn tại
if (cartIcon) {
  cartIcon.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "block";
  });
}

// Đóng modal khi nút "×" tồn tại
if (closeModal) {
  closeModal.addEventListener("click", function () {
    cartModal.style.display = "none";
  });
}

// Đóng modal nếu người dùng bấm ngoài vùng modal
window.addEventListener("click", function (event) {
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
});
