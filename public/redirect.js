// API Redirect Script - Loads before everything
(function() {
  console.log('🔄 API Redirect Active');
  
  const RENDER_BACKEND = 'https://portfolio-backend-2-ly21.onrender.com';
  
  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string') {
      if (url.startsWith('/api/')) {
        url = RENDER_BACKEND + url;
      }
      if (url.includes('vercel.app/api')) {
        url = url.replace(/https:\/\/.*?\.vercel\.app\/api/, RENDER_BACKEND + '/api');
      }
      console.log('📤', url);
    }
    return originalFetch(url, options);
  };
  
  // Override XMLHttpRequest for axios
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string') {
      if (url.startsWith('/api/')) {
        url = RENDER_BACKEND + url;
      }
      if (url.includes('vercel.app/api')) {
        url = url.replace(/https:\/\/.*?\.vercel\.app\/api/, RENDER_BACKEND + '/api');
      }
    }
    return origOpen.call(this, method, url);
  };
})();