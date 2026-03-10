import { MerchantPreset, StrategyConfig, StrategyKey } from "@/types/simulation";

export const STRATEGIES: StrategyConfig[] = [
  {
    key: "strict",
    label: "Strict",
    approvalDelta: -4,
    fraudDelta: -0.3,
    recoveryRate: 0,
    description: "Prioritize fraud control and margin protection.",
  },
  {
    key: "balanced",
    label: "Balanced",
    approvalDelta: 1.5,
    fraudDelta: 0.1,
    recoveryRate: 6,
    description: "Moderate conversion lift with contained fraud exposure.",
  },
  {
    key: "aggressive",
    label: "Aggressive",
    approvalDelta: 4,
    fraudDelta: 0.45,
    recoveryRate: 12,
    description: "Maximize conversion with higher fraud tolerance.",
  },
];

export const STRATEGY_MAP = STRATEGIES.reduce(
  (acc, strategy) => {
    acc[strategy.key] = strategy;
    return acc;
  },
  {} as Record<StrategyKey, StrategyConfig>
);

export const DEFAULT_CUSTOM_STRATEGY: StrategyConfig = {
  key: "custom",
  label: "Custom Strategy",
  approvalDelta: 0,
  fraudDelta: 0,
  recoveryRate: 0,
};

export const MERCHANT_PRESETS: MerchantPreset[] = [
  {
    key: "low-risk-saas",
    label: "Subscription SaaS (Low Risk)",
    description: "Stable recurring payments with low fraud pressure.",
    inputs: {
      transactionCount: 22000,
      averageTicket: 48,
      approvalRate: 95.5,
      fraudRate: 0.25,
      processingFeeRate: 2.3,
      chargebackCost: 12,
      refundRate: 0.9,
      declineRecoveryRate: 1.2,
      merchantMarginRate: 22,
    },
  },
  {
    key: "mid-risk-ecommerce",
    label: "Marketplace Retail (Mid Risk)",
    description: "Mixed basket sizes with moderate dispute exposure.",
    inputs: {
      transactionCount: 15000,
      averageTicket: 95,
      approvalRate: 91.5,
      fraudRate: 0.9,
      processingFeeRate: 2.8,
      chargebackCost: 25,
      refundRate: 2.2,
      declineRecoveryRate: 2.5,
      merchantMarginRate: 14,
    },
  },
  {
    key: "high-risk-digital",
    label: "Digital Goods & Gaming (High Risk)",
    description: "Instant fulfillment with elevated chargeback risk.",
    inputs: {
      transactionCount: 10000,
      averageTicket: 40,
      approvalRate: 86,
      fraudRate: 2.8,
      processingFeeRate: 3.2,
      chargebackCost: 38,
      refundRate: 3.8,
      declineRecoveryRate: 4,
      merchantMarginRate: 16,
    },
  },
];
