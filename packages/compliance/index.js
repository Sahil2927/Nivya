/** @typedef {import('./types.js').ComplianceConfig} ComplianceConfig */

const DEFAULT_ARN = process.env.NIVYA_ARN || "ARN-XXXXXX";
const DEFAULT_EUIN = process.env.NIVYA_EUIN || "E123456";

/** @returns {ComplianceConfig} */
export function getComplianceConfig(overrides = {}) {
  const arn = overrides.arn || DEFAULT_ARN;
  return {
    arn,
    euin: overrides.euin || DEFAULT_EUIN,
    tagline: `AMFI-registered Mutual Fund Distributor · ${arn}`,
    distributorLabel: "AMFI-registered Mutual Fund Distributor",
    riskDisclaimer:
      "Mutual fund investments are subject to market risks. Read all scheme related documents carefully.",
    regularPlanOnly: true,
  };
}

/** @param {{ arn?: string, euin?: string }} cfg */
export function assertOrderCompliance(cfg) {
  const { arn, euin } = getComplianceConfig(cfg);
  if (!arn) throw new Error("COMPLIANCE_ARN_MISSING");
  if (!euin) throw new Error("COMPLIANCE_EUIN_MISSING");
  if (arn === "ARN-XXXXXX" && process.env.NIVYA_STRICT_COMPLIANCE === "true") {
    throw new Error("COMPLIANCE_ARN_PLACEHOLDER");
  }
  return { arn, euin };
}

export function getDisclosures(overrides = {}) {
  const cfg = getComplianceConfig(overrides);
  return {
    arn: cfg.arn,
    tagline: cfg.tagline,
    riskDisclaimer: cfg.riskDisclaimer,
    distributorLabel: cfg.distributorLabel,
  };
}
