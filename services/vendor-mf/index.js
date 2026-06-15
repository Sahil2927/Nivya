import { createMockVendorMFAdapter } from "./mock-adapter.js";

export { createMockVendorMFAdapter } from "./mock-adapter.js";
export { SCHEMES, DEMO_HOLDINGS, DEMO_SIPS, schemeByCode, tickNavs } from "./mock-data.js";

/** @returns {import('./types.js').VendorMFAdapter} */
export function createVendorMFAdapter(kind = process.env.VENDOR_MF_ADAPTER || "mock") {
  if (kind === "mock") return createMockVendorMFAdapter();
  throw new Error(`Unknown VENDOR_MF_ADAPTER: ${kind}`);
}
