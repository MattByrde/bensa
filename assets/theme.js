/* ============================================
   BENSA — Furniture Store Theme
   Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Mobile Navigation ---- */
  const mobileNav = {
    init() {
      const toggle = document.querySelector('.site-header__menu-toggle');
      const nav = document.querySelector('.mobile-nav');
      const close = document.querySelector('.mobile-nav__close');

      if (!toggle || !nav) return;

      toggle.addEventListener('click', () => this.open(nav));
      if (close) close.addEventListener('click', () => this.close(nav));

      nav.addEventListener('click', (e) => {
        if (e.target === nav) this.close(nav);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          this.close(nav);
        }
      });
    },

    open(nav) {
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },

    close(nav) {
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  /* ---- Quantity Selectors ---- */
  const quantitySelectors = {
    init() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.quantity-btn');
        if (!btn) return;

        const wrapper = btn.closest('.product-info__quantity, .cart-item__quantity');
        const input = wrapper?.querySelector('.quantity-input');
        if (!input) return;

        const current = parseInt(input.value, 10) || 1;
        const min = parseInt(input.min, 10) || 1;
        const max = parseInt(input.max, 10) || 9999;

        if (btn.dataset.action === 'decrease' && current > min) {
          input.value = current - 1;
        } else if (btn.dataset.action === 'increase' && current < max) {
          input.value = current + 1;
        }

        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  };

  /* ---- Product Tabs ---- */
  const productTabs = {
    init() {
      document.querySelectorAll('.product-tab__trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const tab = trigger.closest('.product-tab');
          if (!tab) return;
          tab.classList.toggle('is-open');
        });
      });
    }
  };

  /* ---- Product Gallery Thumbnails ---- */
  const productGallery = {
    init() {
      const thumbs = document.querySelectorAll('.product-gallery__thumb');
      const mainImage = document.querySelector('.product-gallery__main img');

      if (!thumbs.length || !mainImage) return;

      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const img = thumb.querySelector('img');
          if (!img) return;

          mainImage.src = img.dataset.fullSrc || img.src;
          mainImage.alt = img.alt;

          thumbs.forEach((t) => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
        });
      });
    }
  };

  /* ---- Cart Drawer ---- */
  const cartDrawer = {
    init() {
      const drawer = document.querySelector('.cart-drawer');
      const overlay = document.querySelector('.cart-drawer__overlay');
      const closeBtn = document.querySelector('.cart-drawer__close');
      const cartToggles = document.querySelectorAll('[data-cart-toggle]');

      if (!drawer) return;

      cartToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.open(drawer, overlay);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', () => this.close(drawer, overlay));
      if (overlay) overlay.addEventListener('click', () => this.close(drawer, overlay));

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
          this.close(drawer, overlay);
        }
      });
    },

    open(drawer, overlay) {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },

    close(drawer, overlay) {
      drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  /* ---- AJAX Cart ---- */
  const ajaxCart = {
    async addToCart(formData) {
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Add to cart failed');

        const item = await response.json();
        await this.refreshCart();
        return item;
      } catch (error) {
        console.error('Cart error:', error);
        throw error;
      }
    },

    async updateCart(updates) {
      try {
        const response = await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates }),
        });

        if (!response.ok) throw new Error('Update cart failed');

        const cart = await response.json();
        await this.refreshCart();
        return cart;
      } catch (error) {
        console.error('Cart error:', error);
        throw error;
      }
    },

    async removeFromCart(key) {
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: key, quantity: 0 }),
        });

        if (!response.ok) throw new Error('Remove from cart failed');

        const cart = await response.json();
        await this.refreshCart();
        return cart;
      } catch (error) {
        console.error('Cart error:', error);
        throw error;
      }
    },

    async getCart() {
      const response = await fetch('/cart.js');
      return response.json();
    },

    async refreshCart() {
      const cart = await this.getCart();
      this.updateCartCount(cart.item_count);
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    },

    updateCartCount(count) {
      document.querySelectorAll('.site-header__cart-count').forEach((el) => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
      });
    }
  };

  /* ---- Add to Cart Forms ---- */
  const addToCartForms = {
    init() {
      document.addEventListener('submit', async (e) => {
        const form = e.target.closest('form[action="/cart/add"]');
        if (!form) return;

        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        if (!submitBtn) return;

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';

        try {
          await ajaxCart.addToCart(new FormData(form));
          submitBtn.textContent = 'Added!';

          const drawer = document.querySelector('.cart-drawer');
          const overlay = document.querySelector('.cart-drawer__overlay');
          if (drawer) cartDrawer.open(drawer, overlay);

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 1500);
        } catch {
          submitBtn.textContent = 'Error';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 1500);
        }
      });
    }
  };

  /* ---- Variant Picker ---- */
  const variantPicker = {
    init() {
      document.addEventListener('click', (e) => {
        const option = e.target.closest('.variant-picker__option');
        if (!option || option.classList.contains('is-unavailable')) return;

        const picker = option.closest('.variant-picker');
        if (!picker) return;

        picker.querySelectorAll('.variant-picker__option').forEach((opt) => {
          opt.classList.remove('is-selected');
        });
        option.classList.add('is-selected');

        const input = picker.querySelector('input[type="hidden"]');
        if (input) {
          input.value = option.dataset.value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
  };

  /* ---- Sticky Header on Scroll ---- */
  const stickyHeader = {
    init() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      const navRow = header.querySelector('.site-header__row--nav');
      const searchRow = header.querySelector('.site-header__row--search');
      const spacer = header.querySelector('[data-nav-spacer]');
      if (!navRow) return;

      // Threshold for is-scrolled (scroll-cart etc): when search row bottom leaves viewport
      const searchBottom = searchRow
        ? searchRow.getBoundingClientRect().bottom + window.scrollY
        : navRow.offsetHeight;
      const searchH = searchRow ? searchRow.offsetHeight : 0;

      let isFixed = false;
      let isScrolled = false;

      const update = () => {
        const y = window.scrollY;

        // Fix nav row as soon as any scroll happens
        if (!isFixed && y > 0) {
          isFixed = true;
          navRow.classList.add('is-nav-fixed');
          if (spacer) spacer.style.height = navRow.offsetHeight + 'px';
        } else if (isFixed && y <= 0) {
          isFixed = false;
          navRow.classList.remove('is-nav-fixed');
          if (spacer) spacer.style.height = '0';
        }

        // is-scrolled: show scroll-cart etc. after search row is gone
        if (!isScrolled && y > searchBottom) {
          isScrolled = true;
          header.classList.add('is-scrolled');
        } else if (isScrolled && y <= searchBottom - searchH) {
          isScrolled = false;
          header.classList.remove('is-scrolled');
        }
      };

      // Keep spacer in sync if nav height changes (e.g. is-scrolled min-height tweak)
      if (window.ResizeObserver && spacer) {
        new ResizeObserver(() => {
          if (isFixed) spacer.style.height = navRow.offsetHeight + 'px';
        }).observe(navRow);
      }

      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  };

  /* ---- Announcement Bar Dismiss ---- */
  const announcementBar = {
    init() {
      const bar = document.querySelector('.announcement-bar');
      const dismiss = document.querySelector('.announcement-bar__dismiss');

      if (!bar || !dismiss) return;

      dismiss.addEventListener('click', () => {
        bar.style.display = 'none';
        sessionStorage.setItem('announcement-dismissed', 'true');
      });

      if (sessionStorage.getItem('announcement-dismissed') === 'true') {
        bar.style.display = 'none';
      }
    }
  };

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', () => {
    mobileNav.init();
    quantitySelectors.init();
    productTabs.init();
    productGallery.init();
    cartDrawer.init();
    addToCartForms.init();
    variantPicker.init();
    announcementBar.init();
    stickyHeader.init();
  });

  /* Expose ajaxCart for use in templates */
  window.BensaCart = ajaxCart;
})();
