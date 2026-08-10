const request = async (path, options = {}) => {
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (user?.token) {
    headers.set("Authorization", `Bearer ${user.token}`);
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Unable to complete the request");
  }

  return data;
};

const jsonRequest = (method, body) => ({
  method,
  body: JSON.stringify(body),
});

export const productsApi = {
  list: () => request("/products"),
  getById: (productId) => request(`/products/${productId}`),
  create: (product) => request("/products", jsonRequest("POST", product)),
  update: (productId, product) =>
    request(`/products/${productId}`, jsonRequest("PUT", product)),
  remove: (productId) => request(`/products/${productId}`, { method: "DELETE" }),
};

export const authApi = {
  register: (credentials) => request("/auth/register", jsonRequest("POST", credentials)),
  login: (credentials) => request("/auth/login", jsonRequest("POST", credentials)),
  users: () => request("/auth/users"),
};

export const ordersApi = {
  create: (items, shippingAddress, paymentMethod) => request("/orders", jsonRequest("POST", { items, shippingAddress, paymentMethod })),
  list: () => request("/orders"),
  mine: () => request("/orders/myorders"),
  getById: (orderId) => request(`/orders/${orderId}`),
  updateStatus: (orderId, status) =>
    request(`/orders/${orderId}/status`, jsonRequest("PUT", { status })),
  confirmPayment: (orderId) => request(`/orders/${orderId}/confirm-payment`, { method: "POST" }),
  cancel: (orderId, reason) => request(`/orders/${orderId}/cancel`, jsonRequest("POST", { reason })),
};

export const paymentsApi = {
  config: () => request('/payments/config'),
  createCheckoutSession: (orderId) => request('/payments/create-checkout-session', jsonRequest('POST', { orderId })),
  getCheckoutSession: (sessionId) => request(`/payments/checkout-sessions/${sessionId}`),
  createIntent: (orderId) =>
    request("/payments/create-payment-intent", jsonRequest("POST", { orderId })),
  getIntent: (paymentIntentId) => request(`/payments/payment-intents/${paymentIntentId}`),
};

export const analyticsApi = {
  getStats: () => request("/analytics"),
};
