import { SimulationResult } from "@/types/simulation";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardsProps {
  results: SimulationResult;
}

export function KpiCards({ results }: KpiCardsProps) {
  const netProfitMargin =
    results.approvedVolume > 0 ? (results.netProfit / results.approvedVolume) * 100 : 0;
  const items = [
    { label: "Approved transactions", value: formatNumber(results.approvedTransactions) },
    { label: "Declined transactions", value: formatNumber(results.declinedTransactions) },
    { label: "Attempted payment volume (GPV)", value: formatCurrency(results.attemptedVolume) },
    { label: "Approved payment volume (GPV)", value: formatCurrency(results.approvedVolume) },
    { label: "Fraud loss (estimated)", value: formatCurrency(results.fraudLoss) },
    { label: "Processing fees", value: formatCurrency(results.processingCost) },
    { label: "Net revenue pre-fraud", value: formatCurrency(results.netRevenueBeforeFraud) },
    { label: "Net profit after fraud", value: formatCurrency(results.netProfit) },
    { label: "Net profit margin", value: formatPercent(netProfitMargin) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outcome KPIs</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Performance summary for the selected strategy.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">{item.label}</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{item.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
