document.addEventListener('DOMContentLoaded', () => {
  const stepBtns = document.querySelectorAll('.step-btn');
  const steps = document.querySelectorAll('.checkout-step');
  
  // Navigate steps
  window.goToStep = function(stepIndex) {
    steps.forEach((s, idx) => {
      if (idx === stepIndex) {
        s.style.display = 'block';
      } else {
        s.style.display = 'none';
      }
    });

    stepBtns.forEach((btn, idx) => {
      if (idx <= stepIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (stepIndex === 2) {
      renderReviewOrder();
    }
  };

  // Step 1 -> 2
  const addressForm = document.getElementById('address-form');
  if (addressForm) {
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      goToStep(1);
    });
  }

  // Payment Method Toggles
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const paymentDetails = document.querySelectorAll('.payment-details');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      paymentDetails.forEach(detail => detail.style.display = 'none');
      document.getElementById(`details-${e.target.value}`).style.display = 'block';
    });
  });

  // Step 2 -> 3
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      goToStep(2);
    });
  }

  // Review Order
  function renderReviewOrder() {
    const reviewItems = document.getElementById('review-items');
    const reviewTotal = document.getElementById('review-total');
    
    if (!reviewItems) return;

    reviewItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      reviewItems.innerHTML += `
        <div class="d-flex justify-between mb-2">
          <span>${item.quantity}x ${item.name}</span>
          <span class="fw-semibold">₹${item.price * item.quantity}</span>
        </div>
      `;
    });

    const shipping = subtotal > 499 ? 0 : 49;
    const total = subtotal + shipping;

    if (shipping > 0) {
      reviewItems.innerHTML += `
        <div class="d-flex justify-between mb-2 text-muted">
          <span>Shipping</span>
          <span>₹${shipping}</span>
        </div>
      `;
    }

    reviewTotal.textContent = `₹${total}`;
  }

  // Place Order
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      // Confetti Animation
      var duration = 3 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      placeOrderBtn.textContent = 'Processing...';
      placeOrderBtn.disabled = true;

      setTimeout(() => {
        // Clear cart
        localStorage.removeItem('shopnova_cart');
        
        // Redirect or show success (simple redirect simulation)
        document.body.innerHTML = `
          <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
            <h1>Order Placed Successfully!</h1>
            <p class="text-muted mt-2">Thank you for shopping with ShopNova.</p>
            <a href="index.html" class="btn btn--primary mt-4">Return Home</a>
          </div>
        `;
      }, 3000);
    });
  }
});
