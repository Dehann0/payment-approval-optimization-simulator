import { SimulationResult, StrategyConfig } from "@/types/simulation";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

interface InsightInputs {
  baseline: SimulationResult;
  selected: SimulationResult;
  selectedStrategy: StrategyConfig;
  bestStrategyLabel: string;
  bestStrategyKey: string;
}

export function generateInsights({
  baseline,
  selected,
  selectedStrategy,
  bestStrategyLabel,
  bestStrategyKey,
}: InsightInputs) {
  const insights: string[] = [];
  const approvalDelta = selected.approvalRate - baseline.approvalRate;
  const profitDelta = selected.netProfit - baseline.netProfit;
  const fraudDelta = selected.fraudRate - baseline.fraudRate;
  const fraudLossShare = selected.approvedVolume > 0 ? selected.fraudLoss / selected.approvedVolume : 0;
  const processingShare =
    selected.approvedVolume > 0 ? selected.processingCost / selected.approvedVolume : 0;
  const marginShare = selected.approvedVolume > 0 ? selected.netProfit / selected.approvedVolume : 0;
  const approvalDeltaPp = `${formatPercent(approvalDelta).replace("%", "pp")}`;

  if (profitDelta !== 0) {
    const profitDirection = profitDelta > 0 ? "improves" : "declines";
    insights.push(
      `Net profit ${profitDirection} by ${formatCurrency(
        Math.abs(profitDelta)
      )} with a ${approvalDeltaPp} conversion shift.`
    );
  }

  if (fraudDelta !== 0) {
    const fraudDirection = fraudDelta > 0 ? "increases" : "decreases";
    insights.push(
      `Fraud rate ${fraudDirection} by ${formatPercent(Math.abs(fraudDelta)).replace(
        "%",
        "pp"
      )}; fraud loss now represents ${formatPercent(
        fraudLossShare * 100
      )} of approved volume.`
    );
  }

  if (selected.recoveredTransactions > 0) {
    insights.push(
      `Decline recovery adds ${formatNumber(
        Math.round(selected.recoveredTransactions)
      )} incremental approvals without changing baseline issuer behavior.`
    );
  }

  if (fraudLossShare > processingShare && fraudLossShare > 0.01) {
    insights.push("Fraud loss exceeds processing fees, making risk cost the primary drag on margin.");
  }

  if (marginShare > 0.05) {
    insights.push("Profit per approved dollar is healthy, indicating pricing and risk controls are aligned.");
  } else if (marginShare > 0 && marginShare <= 0.05) {
    insights.push("Profit per approved dollar is thin; small fraud or cost swings can flip profitability.");
  }

  if (selectedStrategy.key === bestStrategyKey) {
    insights.push(`${selectedStrategy.label} is currently the strongest profit posture for this profile.`);
  } else {
    insights.push(`${bestStrategyLabel} yields the highest net profit for this merchant profile.`);
  }

  const profitPerApproved = selected.approvedTransactions
    ? selected.netProfit / selected.approvedTransactions
    : 0;

  if (profitPerApproved < 0) {
    insights.push("Each approved transaction is unprofitable at current fraud and cost levels.");
  }

  return insights.slice(0, 5);
}

export function getRecommendationLabel(key: string) {
  switch (key) {
    case "strict":
      return "Adopt Strict posture";
    case "balanced":
      return "Adopt Balanced posture";
    case "aggressive":
      return "Adopt Aggressive posture";
    default:
      return "Investigate custom tuning";
  }
}
