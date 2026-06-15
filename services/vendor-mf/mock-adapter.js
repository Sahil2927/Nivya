import { randomUUID } from "node:crypto";
import { SCHEMES, schemeByCode } from "./mock-data.js";

/** @type {import('./types.js').VendorMFAdapter} */
export function createMockVendorMFAdapter() {
  return {
    name: "mock",

    async listSchemes({ category, q } = {}) {
      let items = [...SCHEMES];
      if (category) items = items.filter((s) => s.category === category);
      if (q) {
        const needle = q.toLowerCase();
        items = items.filter(
          (s) =>
            s.name.toLowerCase().includes(needle) ||
            s.amc.toLowerCase().includes(needle) ||
            s.schemeCode.includes(needle)
        );
      }
      return items;
    },

    async getScheme(schemeCode) {
      return schemeByCode(schemeCode);
    },

    async submitOrder(req) {
      const scheme = schemeByCode(req.schemeCode);
      if (!scheme) {
        return { vendorRef: "", status: "rejected", message: "Unknown scheme" };
      }
      if (req.type === "switch" && !req.targetSchemeCode) {
        return { vendorRef: "", status: "rejected", message: "targetSchemeCode required for switch" };
      }
      return {
        vendorRef: `MOCK-${randomUUID().slice(0, 8).toUpperCase()}`,
        status: "accepted",
        message: "Demo order accepted by mock adapter",
      };
    },

    async registerSip({ schemeCode, amount, debitDay }) {
      const scheme = schemeByCode(schemeCode);
      if (!scheme) throw new Error("Unknown scheme");
      if (amount < scheme.minSip) throw new Error(`Minimum SIP is ${scheme.minSip}`);
      if (debitDay < 1 || debitDay > 28) throw new Error("debitDay must be 1–28");
      return {
        vendorRef: `MOCK-SIP-${randomUUID().slice(0, 8).toUpperCase()}`,
        status: "accepted",
      };
    },
  };
}
