 let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

cartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex';
});
closeCart.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

function addToCart(nombre, precio) {
  const existing = cart.find(item => item.nombre === nombre);
  if (existing) {
    existing.cantidad++;
  } else {
    cart.push({ nombre, precio, cantidad: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.precio * item.cantidad;
    count += item.cantidad;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.nombre} (x${item.cantidad})</span>
      <div>
        <button class="btn btn-sm btn-success" onclick="addQuantity(${index})">+</button>
        <button class="btn btn-sm btn-warning" onclick="subtractQuantity(${index})">-</button>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">🗑️</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total;
  cartCount.textContent = count;
}

function addQuantity(index) {
  cart[index].cantidad++;
  updateCart();
}

function subtractQuantity(index) {
  if (cart[index].cantidad > 1) {
    cart[index].cantidad--;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío 🛒');
    return;
  }
  alert('¡Gracias por tu compra! 💖');
  cart = [];
  updateCart();
  cartModal.style.display = 'none';
});
