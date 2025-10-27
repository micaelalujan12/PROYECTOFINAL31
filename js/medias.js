const CART_KEY = 'mi_carrito_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findItem(cart, id) {
  return cart.find(i => i.id === id);
}

function updateCartUI() {
  const cart = loadCart();
  const count = cart.reduce((acc, it) => acc + Number(it.quantity), 0);
  document.getElementById('cart-count').textContent = count;

  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>El carrito está vacío.</p>';
    document.getElementById('cart-total').textContent = '';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const lineTotal = Number(item.price) * Number(item.quantity);
    total += lineTotal;

    const itemDiv = document.createElement('div');
    itemDiv.style.borderBottom = '1px solid #ddd';
    itemDiv.style.padding = '6px 0';
    itemDiv.innerHTML = `
      <div><strong>${item.name}</strong></div>
      <div>Precio: $${Number(item.price).toFixed(0)} — Cantidad: 
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="cart-qty" style="width:48px;">
        <button data-id="${item.id}" class="remove-item">Borrar</button>
      </div>
      <div>Subtotal: $${lineTotal.toFixed(0)}</div>
    `;
    container.appendChild(itemDiv);
  });

  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(0)}`;

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      removeFromCart(id);
    });
  });

  document.querySelectorAll('.cart-qty').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      let q = Number(e.target.value);
      if (!q || q < 1) q = 1;
      changeQuantity(id, q);
    });
  });
}

function addToCart(item) {
  const cart = loadCart();
  const existing = findItem(cart, item.id);
  if (existing) {
    existing.quantity = Number(existing.quantity) + Number(item.quantity);
  } else {
    cart.push({...item});
  }
  saveCart(cart);
  updateCartUI();
}

function removeFromCart(id) {
  let cart = loadCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  updateCartUI();
}

function changeQuantity(id, qty) {
  const cart = loadCart();
  const item = findItem(cart, id);
  if (item) {
    item.quantity = Number(qty);
    saveCart(cart);
    updateCartUI();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price'));
      const item = { id, name, price, quantity: 1 };
      addToCart(item);
      btn.textContent = 'Agregado ✓';
      setTimeout(() => btn.textContent = 'Agregar al carrito', 900);
    });
  });

  const cartButton = document.getElementById('cart-button');
  const cartDropdown = document.getElementById('cart-dropdown');
  cartButton.addEventListener('click', () => {
    cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
    updateCartUI();
  });

  document.getElementById('close-cart').addEventListener('click', () => {
    cartDropdown.style.display = 'none';
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('¡Gracias por tu compra!');
    localStorage.removeItem(CART_KEY);
    updateCartUI();
    cartDropdown.style.display = 'none';
  });

  updateCartUI();
});