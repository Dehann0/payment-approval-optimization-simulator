export type StrategyKey = "strict" | "balanced" | "aggressive" | "custom";

export interface MerchantInputs {
  transactionCount: number;
  averageTicket: number;
  approvalRate: number;
  fraudRate: number;
  processingFeeRate: number;
  chargebackCost: number;
  refundRate: number;
  declineRecoveryRate: number;
  merchantMarginRate: number;
}

export interface StrategyConfig {
  key: StrategyKey | "baseline";
  label: string;
  approvalDelta: number;
  fraudDelta: number;
  recoveryRate: number;
  description?: string;
}

export interface MerchantPreset {
  key: string;
  label: string;
  description: string;
  inputs: MerchantInputs;
}

export interface SimulationResult {
  attemptedVolume: number;
  approvedTransactions: number;
  declinedTransactions: number;
  approvedVolume: number;
  fraudulentTransactions: number;
  fraudLoss: number;
  chargebackOperationalCost: number;
  processingCost: number;
  refundLoss: number;
  merchantRevenue: number;
  netRevenueBeforeFraud: number;
  netProfit: number;
  approvalRate: number;
  fraudRate: number;
  recoveredTransactions: number;
}

export interface SensitivityPoint {
  approvalRate: number;
  fraudRate: number;
  netProfit: number;
}
