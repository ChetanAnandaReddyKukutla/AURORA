// client.js - Client-side interaction handling and adobeDataLayer pushes

(function() {
  'use strict';

  // Cart persistence with localStorage
  const CartStorage = {
    STORAGE_KEY: 'auroraApparel_cart',
    
    // Save cart to localStorage
    save: function(cartData) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
      } catch (e) {
        console.warn('Could not save cart to localStorage:', e);
      }
    },
    
    // Load cart from localStorage
    load: function() {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.warn('Could not load cart from localStorage:', e);
        return null;
      }
    },
    
    // Clear cart from localStorage
    clear: function() {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {
        console.warn('Could not clear cart from localStorage:', e);
      }
    }
  };

  // Expose to global scope for other scripts
  window.CartStorage = CartStorage;

  // Cart persistence helper (localStorage as source of truth)
  const CartPersistence = {
    // Get cart from localStorage
    getCart: function() {
      try {
        const data = localStorage.getItem('auroraApparel_cart_state');
        if (data) {
          return JSON.parse(data);
        }
      } catch (e) {
        console.warn('Could not parse cart state:', e);
      }
      return { items: [], totalQuantity: 0, totalValue: 0, currency: 'USD' };
    },

    // Save cart to localStorage
    saveCart: function(items) {
      try {
        const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
        const cart = {
          items,
          totalQuantity,
          totalValue,
          currency: 'USD'
        };
        localStorage.setItem('auroraApparel_cart_state', JSON.stringify(cart));
        console.log('Cart persisted:', cart.totalQuantity, 'items');
        return cart;
      } catch (e) {
        console.warn('Could not save cart state:', e);
      }
    },

    // Push cart to Adobe Data Layer
    pushToDataLayer: function(cart) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: 'cartUpdate',
        cart: {
          items: (cart.items || []).map(item => ({
            productId: item.productId,
            name: item.productName || item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totalQuantity: cart.totalQuantity || 0,
          totalValue: cart.totalValue || 0,
          currency: 'USD'
        },
        timestamp: new Date().toISOString()
      });
    },

    // Restore and sync cart on page load
    restore: function() {
      const cart = this.getCart();
      if (cart.items && cart.items.length > 0) {
        console.log('Restoring cart from localStorage:', cart.items.length, 'items');
        this.pushToDataLayer(cart);
      }
    }
  };

  // Expose to global scope
  window.CartPersistence = CartPersistence;

  // Sync cart storage
  async function syncCartWithServer() {
    const savedCart = CartStorage.load();
    console.log('Syncing cart - localStorage has:', savedCart ? savedCart.length : 0, 'items');
    
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ cart: savedCart || [] })
      });
      const data = await response.json();
      if (data.success && data.cart) {
        // Update localStorage with server response
        CartStorage.save(data.cart);
        console.log('Cart synced with server:', data.cart.length, 'items');
        return data.cart;
      }
    } catch (error) {
      console.warn('Could not sync cart with server:', error);
    }
    return savedCart || [];
  }

  // Expose to global scope
  window.syncCartWithServer = syncCartWithServer;

  // Ensure adobeDataLayer is initialized
  window.adobeDataLayer = window.adobeDataLayer || [];

  // Show toast notification
  function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#10b981' : '#ef4444'}" stroke-width="2">
        <path d="${type === 'success' ? 'M20 6L9 17l-5-5' : 'M6 18L18 6M6 6l12 12'}"/>
      </svg>
      <span style="color: #1a1a1a; font-weight: 500;">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // Build normalized cart snapshot for analytics
  function buildCartSnapshot(cartItems) {
    const items = (cartItems || []).map(item => ({
      productId: item.productId,
      name: item.productName || item.name || '',
      price: item.price,
      quantity: item.quantity
    }));

    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);

    return {
      currency: 'USD',
      totalQuantity,
      totalValue,
      items
    };
  }

  // Update cart count in header
  async function updateCartCount() {
    // First sync cart from localStorage
    await syncCartWithServer();
    
    const timestamp = new Date().getTime();
    fetch(`/api/cart?t=${timestamp}`, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => res.json())
      .then(data => {
        const cartItems = data.items || data.cart || [];
        console.log('Cart fetched from server:', cartItems.length, 'items');
        // Always save to localStorage to keep in sync
        window.CartStorage.save(cartItems);
        const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0);
        console.log('Cart count updated:', cartCount);
        const countElements = document.querySelectorAll('#cart-badge, #cart-count');
        countElements.forEach(el => {
          el.textContent = cartCount;
        });
      })
      .catch(err => console.error('Error updating cart count:', err));
  }

  // Expose updateCartCount to global scope
  window.updateCartCount = updateCartCount;

  // Product click handler (PLP)
  function handleProductClick(event) {
    const viewButton = event.target.closest('.view-product');
    if (!viewButton) return;

    event.preventDefault();
    
    const productId = viewButton.getAttribute('data-product-id');
    const position = viewButton.getAttribute('data-position');
    const productCard = viewButton.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const priceText = productCard.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const category = productCard.querySelector('.category').textContent;

    // Push productClick event
    window.adobeDataLayer.push({
      event: "productClick",
      custData: {
        custId: "",
        emailID_plain: "",
        mobileNo_plain: "",
        loginStatus: "guest",
        loginMethod: ""
      },
      eventInfo: { eventName: "productClick" },
      product: [{
        productId: productId,
        name: productName,
        brand: "Aurora Apparel",
        category: category,
        price: price,
        position: parseInt(position)
      }],
      timestamp: new Date().toISOString()
    });

    console.log('Product click tracked:', productId);

    // Navigate to PDP
    setTimeout(() => {
      window.location.href = viewButton.getAttribute('href');
    }, 100);
  }

  // Add to cart handler (PDP)
  function handleAddToCart(event) {
    const button = event.target.closest('#add-to-cart');
    if (!button) return;

    const productId = button.getAttribute('data-product-id');
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    // Add loading state
    button.disabled = true;
    button.classList.add('btn-loading');
    const originalText = button.textContent;

    fetch('/api/cart/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: productId,
        quantity: quantity
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Save cart to localStorage
        window.CartStorage.save(data.cart);
        // Persist to localStorage state
        window.CartPersistence.saveCart(data.cart);
        
        // Find the added product in cart
        const addedProduct = data.cart.find(item => item.productId === productId);
        
        // Push scAdd event with full cart snapshot
        window.adobeDataLayer.push({
          event: "scAdd",
          custData: {
            custId: "",
            emailID_plain: "",
            mobileNo_plain: "",
            loginStatus: "guest",
            loginMethod: ""
          },
          eventInfo: { eventName: "scAdd" },
          product: [{
            productId: addedProduct.productId,
            name: addedProduct.productName,
            price: addedProduct.price,
            quantity: quantity
          }],
          cart: buildCartSnapshot(data.cart),
          timestamp: new Date().toISOString()
        });

        console.log('Added to cart:', addedProduct);

        // Show toast notification
        showToast(`Added ${addedProduct.productName} to cart!`, 'success');
        
        // Update cart count with animation
        updateCartCount();

        // Reset button with success state
        button.classList.remove('btn-loading');
        button.innerHTML = '✓ Added!';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        setTimeout(() => {
          button.disabled = false;
          button.innerHTML = originalText;
          button.style.background = '';
        }, 2000);
      } else {
        throw new Error('Failed to add to cart');
      }
    })
    .catch(err => {
      console.error('Error adding to cart:', err);
      showToast('Error adding to cart. Please try again.', 'error');
      button.classList.remove('btn-loading');
      button.disabled = false;
      button.textContent = originalText;
    });
  }

  // Remove from cart handler (Cart page)
  function handleRemoveFromCart(event) {
    const button = event.target.closest('.remove-item');
    if (!button) return;

    const productId = button.getAttribute('data-product-id');
    const row = button.closest('tr');

    // Capture product details before removal for analytics
    const productName = row ? (row.querySelector('strong')?.textContent || '') : '';
    const priceText = row ? (row.querySelector('td:nth-child(3)')?.textContent || '$0') : '$0';
    const price = parseFloat(priceText.replace('$', '')) || 0;
    const quantityText = row ? (row.querySelector('.qty-value')?.textContent || '1') : '1';
    const quantity = parseInt(quantityText, 10) || 1;

    // Add loading state
    button.disabled = true;
    button.classList.add('btn-loading');

    fetch('/api/cart/remove', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: productId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Save cart to localStorage
        window.CartStorage.save(data.cart);
        // Persist to localStorage state
        window.CartPersistence.saveCart(data.cart);
        
        // Push scRemove event with full cart snapshot
        window.adobeDataLayer.push({
          event: "scRemove",
          custData: {
            custId: "",
            emailID_plain: "",
            mobileNo_plain: "",
            loginStatus: "guest",
            loginMethod: ""
          },
          eventInfo: { eventName: "scRemove" },
          product: [{
            productId: productId,
            name: productName,
            price: price,
            quantity: quantity
          }],
          cart: buildCartSnapshot(data.cart),
          timestamp: new Date().toISOString()
        });

        console.log('Removed from cart:', productId);

        // Animate row removal
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          showToast('Item removed from cart', 'success');
          window.location.reload();
        }, 300);
      } else {
        throw new Error('Failed to remove from cart');
      }
    })
    .catch(err => {
      console.error('Error removing from cart:', err);
      showToast('Error removing item. Please try again.', 'error');
      button.classList.remove('btn-loading');
      button.disabled = false;
    });
  }

  // Cart link click handler
  function handleCartLinkClick(event) {
    const cartLink = event.target.closest('#cart-link');
    if (!cartLink) return;

    // Push scOpen event
    window.adobeDataLayer.push({
      event: "scOpen",
      custData: {
        custId: "",
        emailID_plain: "",
        mobileNo_plain: "",
        loginStatus: "guest",
        loginMethod: ""
      },
      eventInfo: { eventName: "scOpen" },
      timestamp: new Date().toISOString()
    });

    console.log('Cart opened via navigation');
  }

  // Initialize event listeners when DOM is ready
  function init() {
    // Restore cart from localStorage on page load
    if (window.CartPersistence) {
      window.CartPersistence.restore();
    }

    // PLP: Product click tracking
    document.addEventListener('click', handleProductClick);

    // PDP: Add to cart
    document.addEventListener('click', handleAddToCart);

    // Cart: Remove from cart
    document.addEventListener('click', handleRemoveFromCart);

    // Cart link click
    document.addEventListener('click', handleCartLinkClick);

    // Sync cart and update count on page load
    updateCartCount();

    console.log('Client-side event handlers initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
