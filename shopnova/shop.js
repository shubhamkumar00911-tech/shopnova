// Shop Page Logic
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const emptyState = document.getElementById('empty-state');
  const filterForm = document.getElementById('filter-form');
  const activeFiltersContainer = document.getElementById('active-filters');
  const priceOutput = document.getElementById('price-output');
  const priceInput = document.getElementById('price-filter');
  
  if (!productGrid) return; // Only run on products.html

  // Initialize URL parameters for category filtering from homepage
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const catCheckbox = document.querySelector(`input[value="${catParam}"]`);
    if (catCheckbox) catCheckbox.checked = true;
  }

  function renderProducts(items) {
    productGrid.innerHTML = '';
    
    if (items.length === 0) {
      productGrid.style.display = 'none';
      emptyState.style.display = 'flex';
      return;
    }
    
    productGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    items.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card reveal active';
      card.innerHTML = `
        ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
        <button class="product-card__wishlist" onclick="shopNova.showToast('Added to Wishlist!')">♥</button>
        <div class="product-card__image-container">
          <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
        </div>
        <div class="product-card__info">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__title"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
          <div class="product-card__rating">
            <span class="stars" style="--percent: ${shopNova.getStarPercent(product.rating)}"></span>
            <span class="product-card__rating-count">(${product.reviewCount})</span>
          </div>
          <div class="product-card__price-row">
            <span class="product-card__price">${shopNova.formatCurrency(product.price)}</span>
            ${product.originalPrice > product.price ? `<span class="product-card__price-original">${shopNova.formatCurrency(product.originalPrice)}</span>` : ''}
          </div>
          <button class="btn btn--primary btn--full mt-auto" onclick="shopNova.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
        </div>
      `;
      productGrid.appendChild(card);
    });
  }

  function renderActiveFilters(filters) {
    activeFiltersContainer.innerHTML = '';
    
    // Categories
    filters.categories.forEach(cat => {
      const tag = document.createElement('span');
      tag.className = 'filter-tag';
      tag.innerHTML = `${cat} <button onclick="removeFilter('category', '${cat}')">×</button>`;
      activeFiltersContainer.appendChild(tag);
    });

    // Rating
    if (filters.rating > 0) {
      const tag = document.createElement('span');
      tag.className = 'filter-tag';
      tag.innerHTML = `${filters.rating}+ Stars <button onclick="removeFilter('rating')">×</button>`;
      activeFiltersContainer.appendChild(tag);
    }

    if (activeFiltersContainer.innerHTML !== '') {
      const clearAll = document.createElement('span');
      clearAll.className = 'filter-tag clear-all';
      clearAll.innerHTML = `Clear All`;
      clearAll.onclick = () => {
        filterForm.reset();
        priceOutput.textContent = `₹${priceInput.value}`;
        applyFilters();
      };
      activeFiltersContainer.appendChild(clearAll);
    }
  }

  window.removeFilter = function(type, value) {
    if (type === 'category') {
      document.querySelector(`input[value="${value}"]`).checked = false;
    } else if (type === 'rating') {
      document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
    }
    applyFilters();
  };

  function applyFilters() {
    const formData = new FormData(filterForm);
    
    const filters = {
      categories: formData.getAll('category'),
      price: parseInt(formData.get('price')),
      rating: parseInt(formData.get('rating') || 0),
      sort: formData.get('sort')
    };

    renderActiveFilters(filters);

    let filtered = products.filter(p => {
      const matchCat = filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchPrice = p.price <= filters.price;
      const matchRating = p.rating >= filters.rating;
      return matchCat && matchPrice && matchRating;
    });

    // Sorting
    if (filters.sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'popular') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    renderProducts(filtered);
  }

  // Update price output on slider drag
  priceInput.addEventListener('input', (e) => {
    priceOutput.textContent = `₹${e.target.value}`;
  });

  filterForm.addEventListener('change', applyFilters);

  // Mobile Filter Drawer
  const filterBtn = document.getElementById('mobile-filter-btn');
  const sidebar = document.querySelector('.shop-sidebar');
  if (filterBtn && sidebar) {
    filterBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Initial render
  applyFilters();
});
