// Flash Sale Countdown
function initCountdown() {
  const timerElements = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  if (!timerElements.hours) return;

  function updateTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diff = midnight - now;
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    timerElements.hours.textContent = h.toString().padStart(2, '0');
    timerElements.minutes.textContent = m.toString().padStart(2, '0');
    timerElements.seconds.textContent = s.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Render Best Sellers
function renderBestSellers() {
  const container = document.getElementById('best-sellers-container');
  if (!container || typeof products === 'undefined') return;

  // Filter 8 products for best sellers
  const bestSellers = products.slice(0, 8);

  bestSellers.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
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
    container.appendChild(card);
  });
}

// Three.js Hero Animation
function initThreeJSHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(400, 400);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Object: Icosahedron
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0xF97316, // Vibrant Orange
    emissive: 0x20155E, // Dark Indigo
    specular: 0xffffff,
    shininess: 100,
    wireframe: true
  });
  const shape = new THREE.Mesh(geometry, material);
  scene.add(shape);

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 500;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x3730A3,
    transparent: true,
    opacity: 0.8
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  camera.position.z = 4;

  // Add OrbitControls if available
  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
  }

  // Mouse interactivity for particles
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    requestAnimationFrame(animate);

    if (!prefersReducedMotion) {
      shape.rotation.x += 0.005;
      shape.rotation.y += 0.01;

      particlesMesh.rotation.y += 0.002;
      particlesMesh.rotation.x += 0.001;
      
      // Subtle mouse tracking
      particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
      particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Newsletter
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input.value) {
        shopNova.showToast('Successfully subscribed!');
        input.value = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  renderBestSellers();
  initThreeJSHero();
  initNewsletter();
});
