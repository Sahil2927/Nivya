const API_BASE = "/v1";

let accessToken = null;

async function request(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = new Error(`API ${method} ${path} failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export function mapScheme(s) {
  return {
    id: s.schemeCode,
    s: s.name,
    h: s.amc,
    cat: s.category,
    risk: s.risk,
    r3: s.returns?.r3y ?? 0,
    r1: s.returns?.r1y ?? 0,
    r5: s.returns?.r5y ?? 0,
    nav: s.nav,
    minSip: s.minSip,
    expense: s.expenseRatio,
  };
}

export function mapHolding(h) {
  return {
    id: h.schemeCode,
    units: h.units,
    avgNav: h.avgNav,
    folio: h.folio,
  };
}

export function mapSip(s) {
  return {
    id: s.schemeCode,
    sipKey: s.id,
    amount: s.amount,
    day: s.debitDay,
    status: s.status === "active" ? "Active" : s.status === "paused" ? "Paused" : s.status,
    nextDebit: s.nextDebit || "—",
  };
}

export function navsFromSchemes(schemes) {
  const navs = {};
  for (const s of schemes) {
    navs[s.schemeCode] = { nav: s.nav, prevNav: s.prevNav ?? s.nav * 0.998 };
  }
  return navs;
}

export async function bootstrapDemoSession() {
  const auth = await request("/auth/otp/verify", {
    method: "POST",
    body: { phone: "9876543210", otp: "123456" },
  });
  accessToken = auth.accessToken;

  const [schemesRes, portfolio, sipsRes, disclosures] = await Promise.all([
    request("/schemes"),
    request("/portfolio"),
    request("/sips"),
    request("/compliance/disclosures"),
  ]);

  return {
    schemes: schemesRes.items,
    portfolio,
    sips: sipsRes.items,
    disclosures,
  };
}

export async function fetchSchemes() {
  const res = await request("/schemes");
  return res.items;
}

export async function recordConsent(schemeCode) {
  return request("/consents", {
    method: "POST",
    body: { schemeCode, sidVersion: "v1" },
  });
}

export async function submitOrder(payload) {
  return request("/orders", { method: "POST", body: payload });
}

export async function submitSip(payload) {
  return request("/sips", { method: "POST", body: payload });
}

export async function fetchPortfolio() {
  return request("/portfolio");
}
