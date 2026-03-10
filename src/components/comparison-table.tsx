import { SimulationResult } from "@/types/simulation";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonTableProps {
  baseline: SimulationResult;
  selected: SimulationResult;
  selectedLabel: string;
}

export function ComparisonTable({ baseline, selected, selectedLabel }: ComparisonTableProps) {
  const baselineMargin =
    baseline.approvedVolume > 0 ? (baseline.netProfit / baseline.approvedVolume) * 100 : 0;
  const selectedMargin =
    selected.approvedVolume > 0 ? (selected.netProfit / selected.approvedVolume) * 100 : 0;
  const profitDelta = selected.netProfit - baseline.netProfit;
  const approvalDelta = selected.approvalRate - baseline.approvalRate;

  const rows = [
    {
      label: "Net profit",
      baseline: formatCurrency(baseline.netProfit),
      selected: formatCurrency(selected.netProfit),
    },
    {
      label: "Profit delta",
      baseline: "—",
      selected: formatCurrency(profitDelta),
      delta: profitDelta,
    },
    {
      label: "Net profit margin",
      baseline: formatPercent(baselineMargin),
      selected: formatPercent(selectedMargin),
    },
    {
      label: "Approval rate",
      baseline: formatPercent(baseline.approvalRate),
      selected: formatPercent(selected.approvalRate),
    },
    {
      label: "Approval delta",
      baseline: "—",
      selected: formatPercent(approvalDelta).replace("%", "pp"),
      delta: approvalDelta,
    },
    {
      label: "Fraud rate (of approved)",
      baseline: formatPercent(baseline.fraudRate),
      selected: formatPercent(selected.fraudRate),
    },
    {
      label: "Approved transactions",
      baseline: formatNumber(baseline.approvedTransactions),
      selected: formatNumber(selected.approvedTransactions),
    },
    {
      label: "Fraudulent transactions",
      baseline: formatNumber(baseline.fraudulentTransactions),
      selected: formatNumber(selected.fraudulentTransactions),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Baseline vs selected strategy</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Compare conversion, fraud, and profitability shifts.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <div className="min-w-[420px]">
            <div className="grid grid-cols-3 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <div className="px-4 py-2">Metric</div>
              <div className="px-4 py-2">Baseline</div>
              <div className="px-4 py-2">{selectedLabel}</div>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-3 border-t border-slate-100 text-sm">
              <div className="px-4 py-2 text-slate-600">{row.label}</div>
              <div className="px-4 py-2 text-right text-slate-900">{row.baseline}</div>
                <div
                  className={
                    row.delta === undefined
                    ? "px-4 py-2 text-right text-slate-900"
                      : row.delta > 0
                      ? "px-4 py-2 text-right font-semibold text-emerald-600"
                        : row.delta < 0
                        ? "px-4 py-2 text-right font-semibold text-rose-600"
                        : "px-4 py-2 text-right text-slate-600"
                  }
                >
                  {row.selected}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
