// adl-utils.js - Helper utilities for Adobe Data Layer

(function() {
  'use strict';

  // Initialize global namespace
  window.adl = window.adl || {};

  /**
   * Get the last push from adobeDataLayer
   * @returns {Object|null} Last data layer push or null if empty
   */
  window.adl.getLastPush = function() {
    if (!window.adobeDataLayer || window.adobeDataLayer.length === 0) {
      console.warn('adobeDataLayer is empty or not initialized');
      return null;
    }
    return window.adobeDataLayer[window.adobeDataLayer.length - 1];
  };

  /**
   * Get a nested property from the last push using dot notation
   * @param {string} path - Dot-separated path (e.g., 'page.pageName')
   * @returns {*} Value at path or undefined
   */
  window.adl.get = function(path) {
    const lastPush = window.adl.getLastPush();
    if (!lastPush) {
      return undefined;
    }

    return path.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, lastPush);
  };

  /**
   * Get all pushes from adobeDataLayer
   * @returns {Array} All data layer pushes
   */
  window.adl.getAllPushes = function() {
    return window.adobeDataLayer || [];
  };

  /**
   * Get pushes by event type
   * @param {string} eventName - Event name to filter by
   * @returns {Array} Filtered pushes
   */
  window.adl.getByEvent = function(eventName) {
    if (!window.adobeDataLayer) {
      return [];
    }
    return window.adobeDataLayer.filter(function(push) {
      return push.event === eventName;
    });
  };

  /**
   * Log the current state of the data layer to console
   * @param {boolean} detailed - Whether to show detailed output
   */
  window.adl.debug = function(detailed) {
    console.group('Adobe Data Layer Debug');
    console.log('Total pushes:', window.adobeDataLayer ? window.adobeDataLayer.length : 0);
    
    if (detailed && window.adobeDataLayer) {
      console.log('All pushes:', window.adobeDataLayer);
    }
    
    const lastPush = window.adl.getLastPush();
    if (lastPush) {
      console.log('Last push:', lastPush);
      console.log('Event:', lastPush.event);
      console.log('Page Type:', window.adl.get('page.pageType'));
      console.log('Page Name:', window.adl.get('page.pageName'));
    }
    
    console.groupEnd();
  };

  /**
   * Get current cart state from data layer
   * @returns {Object|null} Cart object or null
   */
  window.adl.getCart = function() {
    // Look through pushes in reverse to find most recent cart
    if (!window.adobeDataLayer) {
      return null;
    }
    
    for (let i = window.adobeDataLayer.length - 1; i >= 0; i--) {
      if (window.adobeDataLayer[i].cart) {
        return window.adobeDataLayer[i].cart;
      }
    }
    return null;
  };

  /**
   * Get current order from data layer (for purchase events)
   * @returns {Object|null} Order object or null
   */
  window.adl.getOrder = function() {
    if (!window.adobeDataLayer) {
      return null;
    }
    
    for (let i = window.adobeDataLayer.length - 1; i >= 0; i--) {
      if (window.adobeDataLayer[i].order) {
        return window.adobeDataLayer[i].order;
      }
    }
    return null;
  };

  // Log initialization
  console.log('Adobe Data Layer utilities loaded. Use window.adl.* methods for debugging.');
  console.log('Available methods: getLastPush(), get(path), getAllPushes(), getByEvent(name), debug(), getCart(), getOrder()');

})();
