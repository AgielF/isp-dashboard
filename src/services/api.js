/**
 * API Service Layer — Real API calls to Express backend
 */

const BASE_URL = "http://localhost:3001/api";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("smyid_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem("smyid_token");
    localStorage.removeItem("smyid_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function apiSend(path, method, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem("smyid_token");
    localStorage.removeItem("smyid_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ---- Auth ----
export const loginAPI = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, message: data.message || "Login gagal" };
  return { success: true, token: data.token, user: data.user };
};

// ---- Dashboard ----
export const fetchDashboardStats = () => apiFetch("/dashboard/stats");

// ---- Routers ----
export const fetchRouters = () => apiFetch("/routers");
export const fetchRouterDetail = (id) => apiFetch(`/routers/${id}`);
export const createRouter = (data) => apiSend("/routers", "POST", data);
export const updateRouter = (id, data) => apiSend(`/routers/${id}`, "PUT", data);
export const deleteRouter = (id) => apiSend(`/routers/${id}`, "DELETE");

// ---- Clients ----
export const fetchClients = () => apiFetch("/clients");
export const createClient = (data) => apiSend("/clients", "POST", data);
export const updateClient = (id, data) => apiSend(`/clients/${id}`, "PUT", data);
export const deleteClient = (id) => apiSend(`/clients/${id}`, "DELETE");

// ---- Bandwidth ----
export const fetchBandwidthHistory = () => apiFetch("/bandwidth/history");

// ---- Alerts ----
export const fetchAlerts = () => apiFetch("/alerts");
export const fetchAlertStats = () => apiFetch("/alerts/stats");
export const acknowledgeAlert = (id) =>
  apiFetch(`/alerts/${id}/ack`, { method: "PUT" });

// ---- Billing ----
export const fetchInvoices = () => apiFetch("/billing");
export const fetchBillingStats = () => apiFetch("/billing/stats");
export const createInvoice = (data) => apiSend("/billing", "POST", data);
export const updateInvoice = (id, data) => apiSend(`/billing/${id}`, "PUT", data);
export const deleteInvoice = (id) => apiSend(`/billing/${id}`, "DELETE");

// ---- Financial ----
export const fetchRevenue = () => apiFetch("/financial/revenue");
export const fetchRevenueByPlan = () => apiFetch("/financial/by-plan");
export const fetchTopClients = () => apiFetch("/financial/top-clients");
export const fetchFinancialStats = () => apiFetch("/financial/stats");

// ---- SMY.ID ----
export const fetchSMYOverview = () => apiFetch("/smyid/overview");
export const fetchSiteSummary = () => apiFetch("/smyid/site-summary");
export const fetchMonthlyData = (category) => apiFetch(`/smyid/monthly/${category}`);

// ---- Installations ----
export const fetchInstallations = () => apiFetch("/installations");
export const createInstallation = (data) => apiSend("/installations", "POST", data);
export const updateInstallation = (id, data) => apiSend(`/installations/${id}`, "PUT", data);
export const deleteInstallation = (id) => apiSend(`/installations/${id}`, "DELETE");

// ---- Maintenance ----
export const fetchMaintenanceLogs = () => apiFetch("/maintenance");
export const createMaintenance = (data) => apiSend("/maintenance", "POST", data);
export const updateMaintenance = (id, data) => apiSend(`/maintenance/${id}`, "PUT", data);
export const deleteMaintenance = (id) => apiSend(`/maintenance/${id}`, "DELETE");



// ---- Weather Analytics ----
export const fetchWeatherCorrelation = () => apiFetch("/weather-analytics/correlation");