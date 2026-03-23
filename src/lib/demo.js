const DEMO_SESSION_STORAGE_KEY = "zenvex_demo_session";
const DEMO_DASHBOARD_STORAGE_KEY = "zenvex_demo_dashboard";
const DEMO_ORDER_STORAGE_KEY = "zenvex_demo_order";

function readStorage(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error);
    return null;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorage(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

function formatNameFromEmail(email) {
  const username = email.split("@")[0] || "Demo Trader";
  return username
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createDemoIdentity({ name, email }) {
  const safeEmail = email?.trim() || "demo@zenvexcapital.com";
  const safeName = name?.trim() || formatNameFromEmail(safeEmail) || "Demo Trader";

  return {
    uid: "demo-user",
    displayName: safeName,
    email: safeEmail,
    isDemo: true,
  };
}

export function loadDemoSession() {
  return readStorage(DEMO_SESSION_STORAGE_KEY);
}

export function saveDemoSession(identity) {
  const session = {
    user: identity,
    profile: {
      userId: identity.uid,
      name: identity.displayName,
      email: identity.email,
      isDemo: true,
    },
  };

  writeStorage(DEMO_SESSION_STORAGE_KEY, session);
  return session;
}

export function clearDemoSession() {
  removeStorage(DEMO_SESSION_STORAGE_KEY);
}

export function loadDemoDashboard() {
  return readStorage(DEMO_DASHBOARD_STORAGE_KEY);
}

export function loadDemoOrder() {
  return readStorage(DEMO_ORDER_STORAGE_KEY);
}

export function createDemoOrder(challenge, identity) {
  const orderId = `demo_${Date.now()}`;
  const createdAt = new Date().toISOString();
  const profitPercent = challenge.accountSize >= 25000 ? 5.4 : challenge.accountSize >= 10000 ? 4.1 : 3.2;
  const balance = Math.round(
    challenge.accountSize + challenge.accountSize * (profitPercent / 100),
  );

  const order = {
    orderId,
    userId: identity.uid,
    accountSize: challenge.accountSize,
    price: challenge.price,
    paymentStatus: "paid",
    createdAt,
    isDemo: true,
  };

  const dashboard = {
    userId: identity.uid,
    accountSize: challenge.accountSize,
    phase: "Phase 1",
    status: "Active",
    balance,
    profitPercent,
    maxDrawdown: challenge.maxDrawdown,
    dailyLoss: challenge.dailyLoss,
    createdAt,
    isDemo: true,
  };

  writeStorage(DEMO_ORDER_STORAGE_KEY, order);
  writeStorage(DEMO_DASHBOARD_STORAGE_KEY, dashboard);

  return order;
}
