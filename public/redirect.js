(function() {
  console.log('🔄 API Redirect Active');
  
  const RENDER_BACKEND = 'https://portfolio-backend-2-ly21.onrender.com';
  
  // Only redirect relative /api/ paths
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string') {
      if (url.startsWith('/api/')) {
        url = RENDER_BACKEND + url;
        console.log('📤 Redirected:', url);
      }
    }
    return originalFetch(url, options);
  };
  
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string') {
      if (url.startsWith('/api/')) {
        url = RENDER_BACKEND + url;
      }
    }
    return origOpen.call(this, method, url);
  };
})();