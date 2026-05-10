document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartState = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const discountRow = document.getElementById('discount-row');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');
  
  const couponInput = document.getElementById('coupon-input');
  const couponBtn = document.getElementById('coupon-btn');

  let discountPercent = 0;

  function renderCart() {
    if (cart.length === 0) {
      cartContent.style.display = 'none';
      emptyCartState.style.display = 'flex';
      return;
    }

    cartContent.style.display = 'grid';
    emptyCartState.style.display = 'none';
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4><a href="product-detail.html?id=${item.id}">${item.name}</a></h4>
          <p class="text-muted">₹${item.price}</p>
        </div>
        <div class="pd-qty-controls" style="height: 36px;">
          <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
          <input type="number" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
        </div>
        <div class="cart-item-price fw-bold">₹${itemTotal}</div>
        <button class="cart-item-remove" onclick="removeItem(${index})">🗑️</button>
      `;
      cartItemsContainer.appendChild(row);
    });

    // Calculations
    const shipping = subtotal > 499 ? 0 : 49;
    const discountAmt = Math.floor(subtotal * discountPercent);
    const total = subtotal + shipping - discountAmt;

    subtotalEl.textContent = `₹${subtotal}`;
    shippingEl.textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    
    if (discountPercent > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${discountAmt}`;
    } else {
      discountRow.style.display = 'none';
    }

    totalEl.textContent = `₹${total}`;
  }

  window.updateQty = function(index, change) {
    if (cart[index].quantity + change > 0) {
      cart[index].quantity += change;
      saveCart();
      renderCart();
    }
  };

  window.removeItem = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    shopNova.showToast('Item removed from cart');
  };

  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      if (couponInput.value.trim().toUpperCase() === 'NOVA10') {
        discountPercent = 0.1;
        renderCart();
        shopNova.showToast('Coupon applied successfully!');
      } else {
        shopNova.showToast('Invalid coupon code', 'error');
      }
    });
  }

  // Initial render
  if (cartItemsContainer) {
    renderCart();
  }
});
