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

  // Update cart count in header
  function updateCartCount() {
    const timestamp = new Date().getTime();
    fetch(`/api/cart?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => res.json())
      .then(data => {
        const cartItems = data.items || data.cart || [];
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
        
        // Find the added product in cart
        const addedProduct = data.cart.find(item => item.productId === productId);
        
        // Push scAdd event
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
            brand: addedProduct.brand,
            category: addedProduct.productCategory,
            price: addedProduct.price,
            quantity: quantity,
            color: addedProduct.color,
            size: addedProduct.size
          }],
          cart: {
            items: data.cart.map(item => ({
              productId: item.productId,
              name: item.productName,
              brand: item.brand,
              category: item.productCategory,
              price: item.price,
              quantity: item.quantity,
              color: item.color,
              size: item.size
            })),
            totalQuantity: data.cart.reduce((sum, item) => sum + item.quantity, 0),
            totalValue: data.total,
            currency: "USD"
          },
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

    // Add loading state
    button.disabled = true;
    button.classList.add('btn-loading');

    fetch('/api/cart/remove', {
      method: 'POST',
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
        // Push scRemove event
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
            productId: productId
          }],
          cart: {
            items: data.cart.map(item => ({
              productId: item.productId,
              name: item.productName,
              brand: item.brand,
              category: item.productCategory,
              price: item.price,
              quantity: item.quantity,
              color: item.color,
              size: item.size
            })),
            totalQuantity: data.cart.reduce((sum, item) => sum + item.quantity, 0),
            totalValue: data.total,
            currency: "USD"
          },
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
    // PLP: Product click tracking
    document.addEventListener('click', handleProductClick);

    // PDP: Add to cart
    document.addEventListener('click', handleAddToCart);

    // Cart: Remove from cart
    document.addEventListener('click', handleRemoveFromCart);

    // Cart link click
    document.addEventListener('click', handleCartLinkClick);

    console.log('Client-side event handlers initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
