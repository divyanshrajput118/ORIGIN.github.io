/* ===================================================
   LUMÈN — JavaScript Application
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============ LOADER ============
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2200);


  // ============ NAVBAR SCROLL ============
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ============ MOBILE MENU ============
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileClose.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));


  // ============ SCROLL REVEAL ============
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ============ CART ============
  let cartItems = [];
  let cartTotal = 0;

  const cartBtn = document.getElementById('cartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCount = document.getElementById('cartCount');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  const openCart = () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  const startShoppingBtn = document.getElementById('startShoppingBtn');
  if (startShoppingBtn) {
    startShoppingBtn.addEventListener('click', closeCart);
  }

  const updateCartUI = () => {
    const count = cartItems.reduce((sum, item) => sum + item.qty, 0);
    if (count > 0) {
      cartCount.textContent = count;
      cartCount.classList.add('visible');
    } else {
      cartCount.classList.remove('visible');
    }

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C4A882" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>Your bag is empty</p>
          <a href="#collections" class="btn btn-primary" id="startShoppingBtn">Start Shopping</a>
        </div>
      `;
      cartFooter.style.display = 'none';
      document.getElementById('startShoppingBtn').addEventListener('click', closeCart);
    } else {
      cartItemsContainer.innerHTML = cartItems.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price} × ${item.qty}</div>
            <span class="cart-item-remove" data-idx="${idx}">Remove</span>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          cartTotal -= cartItems[idx].price * cartItems[idx].qty;
          cartItems.splice(idx, 1);
          updateCartUI();
        });
      });

      cartFooter.style.display = 'block';
      cartTotalEl.textContent = `$${cartTotal}`;
    }
  };

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);

      const existing = cartItems.find(i => i.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cartItems.push({ name, price, qty: 1 });
      }
      cartTotal += price;

      updateCartUI();
      showToast(`"${name}" added to bag ✓`);
      openCart();
    });
  });

  // Checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.addEventListener('click', () => {
    showToast('Redirecting to checkout...');
    setTimeout(closeCart, 1500);
  });


  // ============ WISHLIST ============
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      showToast(isActive ? 'Added to wishlist ♥' : 'Removed from wishlist');
    });
  });


  // ============ PRODUCT FILTERS ============
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = '';
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ============ TESTIMONIALS DRAG ============
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.dot-btn');
  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  track.addEventListener('scroll', () => {
    const cardWidth = 320 + 24;
    const activeIdx = Math.round(track.scrollLeft / cardWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      track.scrollTo({ left: i * (320 + 24), behavior: 'smooth' });
    });
  });


  // ============ NEWSLETTER FORM ============
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    if (email) {
      showToast('Welcome to the circle! 10% off code sent to your inbox ✓');
      newsletterForm.reset();
    }
  });


  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! We\'ll respond within 24 hours ✓');
    contactForm.reset();
  });


  // ============ SEARCH ============
  const searchBtn = document.getElementById('searchBtn');
  searchBtn.addEventListener('click', () => {
    showToast('Search coming soon...');
  });


  // ============ TOAST ============
  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }


  // ============ SMOOTH ANCHOR SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  // ============ NUMBER COUNTER ANIMATION ============
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    const endVal = parseInt(match[1]);
    const suffix = text.replace(/[\d]/g, '');
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * endVal);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

});
