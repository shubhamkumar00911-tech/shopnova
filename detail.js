// Product Detail Logic
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1; // Default to ID 1
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    document.querySelector('main').innerHTML = '<div class="container text-center py-5"><h2>Product not found.</h2><a href="products.html" class="btn btn--primary mt-4">Go to Shop</a></div>';
    return;
  }

  // Populate data
  document.title = `${product.name} | ShopNova`;
  document.getElementById('pd-category').textContent = product.category;
  document.getElementById('pd-name').textContent = product.name;
  document.getElementById('pd-price').textContent = shopNova.formatCurrency(product.price);
  document.getElementById('pd-rating-stars').style.setProperty('--percent', shopNova.getStarPercent(product.rating));
  document.getElementById('pd-review-count').textContent = `(${product.reviewCount} Reviews)`;
  document.getElementById('pd-desc-tab').textContent = product.description;
  
  const mainImg = document.getElementById('pd-main-img');
  mainImg.src = product.image;
  mainImg.alt = product.name;

  // Thumbnails (simulate with seed modifiers)
  const thumbsContainer = document.getElementById('pd-thumbnails');
  for(let i=0; i<4; i++) {
    const thumbSrc = product.image + '?random=' + i;
    const thumb = document.createElement('img');
    thumb.src = thumbSrc;
    thumb.className = `thumbnail ${i===0 ? 'active' : ''}`;
    thumb.onclick = () => {
      mainImg.src = thumbSrc;
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    };
    thumbsContainer.appendChild(thumb);
  }

  // Price & Savings
  if (product.originalPrice > product.price) {
    const savings = product.originalPrice - product.price;
    document.getElementById('pd-original-price').textContent = shopNova.formatCurrency(product.originalPrice);
    document.getElementById('pd-savings').textContent = `You save ${shopNova.formatCurrency(savings)}!`;
  } else {
    document.getElementById('pd-original-price').style.display = 'none';
    document.getElementById('pd-savings').style.display = 'none';
  }

  // Specifications Tab
  const specsList = document.getElementById('pd-specs-list');
  for (const [key, value] of Object.entries(product.specs)) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
    specsList.appendChild(li);
  }

  // Quantity Stepper
  const qtyInput = document.getElementById('pd-qty');
  document.getElementById('pd-qty-minus').onclick = () => {
    if (qtyInput.value > 1) qtyInput.value--;
  };
  document.getElementById('pd-qty-plus').onclick = () => {
    qtyInput.value++;
  };

  // Add to Cart
  document.getElementById('pd-add-to-cart').onclick = () => {
    shopNova.addToCart(product, parseInt(qtyInput.value));
  };
  document.getElementById('pd-buy-now').onclick = () => {
    shopNova.addToCart(product, parseInt(qtyInput.value));
    window.location.href = 'checkout.html';
  };

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    };
  });

  // Pincode Checker
  document.getElementById('pd-pincode-btn').onclick = () => {
    const val = document.getElementById('pd-pincode-input').value;
    const msg = document.getElementById('pd-pincode-msg');
    if (val.length === 6) {
      msg.textContent = "Delivered in 3-5 days.";
      msg.style.color = "var(--color-success)";
    } else {
      msg.textContent = "Please enter a valid 6-digit Pincode.";
      msg.style.color = "var(--color-error)";
    }
  };

  // Related Products
  const relatedContainer = document.getElementById('pd-related');
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  if (relatedProducts.length === 0) relatedProducts.push(...products.slice(0, 4)); // Fallback

  relatedProducts.forEach(rp => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.innerHTML = `
      <div class="product-card__image-container">
        <img src="${rp.image}" alt="${rp.name}" class="product-card__image" loading="lazy">
      </div>
      <div class="product-card__info">
        <h3 class="product-card__title" style="font-size:0.875rem"><a href="product-detail.html?id=${rp.id}">${rp.name}</a></h3>
        <div class="product-card__price-row">
          <span class="product-card__price">${shopNova.formatCurrency(rp.price)}</span>
        </div>
      </div>
    `;
    relatedContainer.appendChild(card);
  });
});
