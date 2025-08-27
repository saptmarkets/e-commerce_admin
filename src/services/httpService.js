import axios from "axios";
import Cookies from "js-cookie";

// Get the correct base URL from environment variable
const getBaseUrl = () => {
  // Use environment variable for API base URL
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL || "https://e-commerce-backend-l0s0.onrender.com/api";
  return baseUrl;
};

// Get base URL
const BASE_URL = getBaseUrl();

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 1800000, // 30 minutes (1,800,000ms) for Odoo sync operations - handles large data fetches
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  console.log('🚨🚨🚨 AXIOS INTERCEPTOR: Request being sent! 🚨🚨🚨');
  console.log('🔍 Original config.url:', config.url);
  console.log('🔍 config.baseURL:', config.baseURL);
  
  // Do something before request is sent
  let adminInfo;
  if (Cookies.get("adminInfo")) {
    adminInfo = JSON.parse(Cookies.get("adminInfo"));
  }

  let company;
  if (Cookies.get("company")) {
    company = Cookies.get("company");
  }

  // Fix URL path for API requests - ensure proper /api/ prefix without duplication
  if (config.url && !config.url.startsWith('http')) {
    const originalUrl = config.url;
    
    // Check if BASE_URL already includes /api
    const baseHasApi = BASE_URL.includes('/api');
    
    if (baseHasApi) {
      // BASE_URL already has /api, so just use the relative URL
      // Remove leading slash from path to avoid double slashes
      let cleanUrl = config.url.startsWith('/') ? config.url.substring(1) : config.url;
      // Always add a leading slash for proper URL construction
      config.url = `/${cleanUrl}`;
    } else {
      // BASE_URL doesn't have /api, so add it
      const cleanUrl = config.url.replace(/^\/+/, ''); // Remove leading slashes
      config.url = `/api/${cleanUrl}`;
    }
    
    console.log('🔍 After URL manipulation:');
    console.log('  - Original URL:', originalUrl);
    console.log('  - Final config.url:', config.url);
    console.log('  - Final full URL will be:', config.baseURL + config.url);
  }
  
  // Add headers
  const headers = {
    authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
    company: company || null,
  };

  return {
    ...config,
    headers: {
      ...config.headers,
      ...headers
    },
  };
}, function (error) {
  console.error("Request error:", error);
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only log essential errors, not every API call
    if (error.response && error.response.status >= 500) {
      console.error("Server error:", error.response.status, error.response.data);
    } else if (error.response && error.response.status === 404) {
      console.error("API endpoint not found:", error.config.url);
    }
    
    return Promise.reject(error);
  }
);

const responseBody = (response) => {
  // Special handling for units and categories endpoints to normalize responses
  if (response.config.url.includes('/units') || response.config.url.includes('/category')) {
    // If the response is an object with a units or categories property, return that
    if (response.data && typeof response.data === 'object') {
      if (response.data.units) {
        return response.data;
      }
      if (response.data.categories) {
        return response.data;
      }
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data;
      }
    }
    // IMPORTANT: If none of the nested conditions matched, but it's a /units or /category URL,
    // we still want to return the direct response.data (which is the array in this case).
    return response.data; // <--- THIS LINE IS THE FIX!
  }
  return response.data;
};

const requests = {
  get: (url, config) =>
    instance.get(url, config).then(responseBody),

  post: (url, body) => {
    console.log('🚨🚨🚨 httpService.post called! 🚨🚨🚨');
    console.log('🔍 URL:', url);
    console.log('🔍 Body:', body);
    console.log('🔍 BASE_URL:', BASE_URL);
    return instance.post(url, body).then(responseBody);
  },

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => 
    instance.delete(url, { data: body }).then(responseBody),
};

export default requests;
