import { MerchantInputs, SensitivityPoint, SimulationResult, StrategyConfig } from "@/types/simulation";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const toDecimal = (value: number) => value / 100;

export function calculateSimulation(inputs: MerchantInputs, strategy: StrategyConfig): SimulationResult {
  const approvalRateRaw = inputs.approvalRate + strategy.approvalDelta;
  const fraudRateRaw = inputs.fraudRate + strategy.fraudDelta;

  const approvalRate = clamp(approvalRateRaw, 0, 100);
  const fraudRateCap = strategy.key === "custom" ? 100 : 10;
  const fraudRate = clamp(fraudRateRaw, 0, fraudRateCap);

  const attemptedVolume = inputs.transactionCount * inputs.averageTicket;
  const baseApproved = inputs.transactionCount * toDecimal(approvalRate);
  const baseDeclined = inputs.transactionCount - baseApproved;

  const recoveryRate = clamp(strategy.recoveryRate, 0, 100);
  const recoveredTransactions = baseDeclined * toDecimal(recoveryRate);
  const approvedTransactions = baseApproved + recoveredTransactions;
  const declinedTransactions = inputs.transactionCount - approvedTransactions;
  const effectiveApprovalRate = inputs.transactionCount > 0 ? (approvedTransactions / inputs.transactionCount) * 100 : 0;

  const approvedVolume = approvedTransactions * inputs.averageTicket;
  const fraudulentTransactions = approvedTransactions * toDecimal(fraudRate);
  const fraudLoss = fraudulentTransactions * inputs.averageTicket;
  const chargebackOperationalCost = fraudulentTransactions * inputs.chargebackCost;
  const processingCost = approvedVolume * toDecimal(inputs.processingFeeRate);
  const refundLoss = approvedVolume * toDecimal(inputs.refundRate);
  const merchantRevenue = approvedVolume * toDecimal(inputs.merchantMarginRate);
  const netRevenueBeforeFraud = merchantRevenue - processingCost - refundLoss;
  const netProfit = netRevenueBeforeFraud - fraudLoss - chargebackOperationalCost;

  return {
    attemptedVolume,
    approvedTransactions,
    declinedTransactions,
    approvedVolume,
    fraudulentTransactions,
    fraudLoss,
    chargebackOperationalCost,
    processingCost,
    refundLoss,
    merchantRevenue,
    netRevenueBeforeFraud,
    netProfit,
    approvalRate: effectiveApprovalRate,
    fraudRate,
    recoveredTransactions,
  };
}

export function buildSensitivitySeries(inputs: MerchantInputs): SensitivityPoint[] {
  const points: SensitivityPoint[] = [];
  for (let delta = -6; delta <= 8; delta += 2) {
    const simulation = calculateSimulation(inputs, {
      key: "baseline",
      label: "Sensitivity",
      approvalDelta: delta,
      fraudDelta: delta * 0.1,
      recoveryRate: inputs.declineRecoveryRate,
    });
    points.push({
      approvalRate: simulation.approvalRate,
      fraudRate: simulation.fraudRate,
      netProfit: simulation.netProfit,
    });
  }
  return points;
}

export function getBestStrategyKey(results: Record<string, SimulationResult>) {
  return Object.entries(results).reduce(
    (best, [key, result]) => {
      if (!best || result.netProfit > best.netProfit) {
        return { key, netProfit: result.netProfit };
      }
      return best;
    },
    null as null | { key: string; netProfit: number }
  );
}
