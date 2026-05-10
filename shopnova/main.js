// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initNavbar();
  initCartState();
  initBackToTop();
  initCookieBanner();
  initScrollReveal();
  init3DProductCards();
});

// --- State Management ---
let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];

function saveCart() {
  localStorage.setItem('shopnova_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart();
  showToast('Added to cart!');
}

function initCartState() {
  updateCartBadge();
}

// --- Loading Splash Screen ---
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 500); // Remove from DOM after fade
    }, 1000);
  }
}

// --- Navbar Mobile Menu ---
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar__links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// --- Back to Top Button ---
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// --- Toast Notification System ---
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 3000);
}

// --- Cookie Consent ---
function initCookieBanner() {
  const hasConsent = localStorage.getItem('shopnova_cookie_consent');
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');

  if (!hasConsent && banner) {
    // Small delay before showing
    setTimeout(() => {
      banner.classList.add('show');
    }, 2000);

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('shopnova_cookie_consent', 'true');
        banner.classList.remove('show');
      });
    }
  }
}

// --- Scroll Reveal Animations ---
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (!reveals.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

// --- 3D Product Card Hover Effect ---
function init3DProductCards() {
  // Only apply if user hasn't requested reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Use event delegation for dynamically added products
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
    const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  document.addEventListener('mouseleave', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    }
  }, true); // Use capture phase for mouseleave
}

// Global utility functions exposed to window
window.shopNova = {
  addToCart,
  showToast,
  formatCurrency: (amount) => `₹${amount.toLocaleString('en-IN')}`,
  getStarPercent: (rating) => `${(rating / 5) * 100}%`
};
