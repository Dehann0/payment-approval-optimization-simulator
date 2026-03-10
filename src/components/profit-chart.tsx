import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SimulationResult, SensitivityPoint } from "@/types/simulation";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfitChartProps {
  baseline: SimulationResult;
  selected: SimulationResult;
  selectedLabel: string;
  sensitivity: SensitivityPoint[];
}

export function ProfitChart({ baseline, selected, selectedLabel, sensitivity }: ProfitChartProps) {
  const safeCurrency = (value: ValueType) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return formatCurrency(value);
    }
    return String(value ?? "");
  };

  const safePercent = (value: ValueType) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return formatPercent(value);
    }
    return String(value ?? "");
  };

  const profitData = [
    { name: "Baseline", netProfit: baseline.netProfit },
    { name: selectedLabel, netProfit: selected.netProfit },
  ];

  const rateData = [
    { name: "Baseline", approvalRate: baseline.approvalRate, fraudRate: baseline.fraudRate },
    { name: selectedLabel, approvalRate: selected.approvalRate, fraudRate: selected.fraudRate },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario visualization</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Profit impact and risk trade-offs across strategies.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">Net profit comparison</div>
          <p className="text-xs text-slate-500">
            Bars reflect net profit after fraud, fees, and chargeback ops costs.
          </p>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: ValueType) => safeCurrency(value)}
                  labelFormatter={(label) => `Scenario: ${label}`}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                <Bar dataKey="netProfit" radius={[6, 6, 0, 0]}>
                  {profitData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.netProfit >= 0 ? "#0f172a" : "#b91c1c"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">Approval vs fraud rate</div>
          <p className="text-xs text-slate-500">
            Fraud rate is shown on a separate axis to preserve readability.
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Approval rate (%)</span>
            <span className="whitespace-nowrap">Fraud rate (% of approved)</span>
          </div>
          <div className="h-56 rounded-lg bg-white p-2 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rateData} margin={{ top: 10, right: 44, left: 44, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => formatPercent(value)}
                  width={88}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => formatPercent(value)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: ValueType, name: string) =>
                    name === "approvalRate"
                      ? [safePercent(value), "Approval rate (%)"]
                      : [safePercent(value), "Fraud rate on approved (%)"]
                  }
                  labelFormatter={(label) => `Scenario: ${label}`}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  yAxisId="left"
                  dataKey="approvalRate"
                  name="Approval rate"
                  fill="#1d4ed8"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fraudRate"
                  name="Fraud rate on approved"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <div className="text-sm font-semibold text-slate-700">Strategy sensitivity</div>
          <p className="text-xs text-slate-500">
            Directional simulation based on incremental approval changes.
          </p>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensitivity} margin={{ top: 10, right: 10, left: 10, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="approvalRate"
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: "Approval rate (%)", position: "bottom", offset: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => formatCurrency(value)}
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Net profit", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => formatPercent(value)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Fraud rate (%)", angle: 90, position: "insideRight" }}
                />
                <Tooltip
                  formatter={(value: ValueType, name: string) =>
                    name === "netProfit" ? safeCurrency(value) : safePercent(value)
                  }
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} verticalAlign="top" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="netProfit"
                  name="Net profit"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fraudRate"
                  name="Fraud rate"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
