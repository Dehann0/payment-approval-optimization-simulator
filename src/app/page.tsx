"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputPanel } from "@/components/input-panel";
import { StrategySelector } from "@/components/strategy-selector";
import { KpiCards } from "@/components/kpi-cards";
import { ComparisonTable } from "@/components/comparison-table";
import { ProfitChart } from "@/components/profit-chart";
import { InsightsPanel } from "@/components/insights-panel";
import { PresetSelector } from "@/components/preset-selector";
import { RecommendationBox } from "@/components/recommendation-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_CUSTOM_STRATEGY,
  MERCHANT_PRESETS,
  STRATEGIES,
  STRATEGY_MAP,
} from "@/lib/strategies";
import { buildSensitivitySeries, calculateSimulation, getBestStrategyKey } from "@/lib/calculations";
import { generateInsights, getRecommendationLabel } from "@/lib/insights";
import { StrategyKey } from "@/types/simulation";

const defaultPreset = MERCHANT_PRESETS[1];

export default function Home() {
  const [inputs, setInputs] = useState(defaultPreset.inputs);
  const [activePresetKey, setActivePresetKey] = useState(defaultPreset.key);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyKey>("balanced");
  const [customStrategy, setCustomStrategy] = useState({
    approvalDelta: DEFAULT_CUSTOM_STRATEGY.approvalDelta,
    fraudDelta: DEFAULT_CUSTOM_STRATEGY.fraudDelta,
    recoveryRate: DEFAULT_CUSTOM_STRATEGY.recoveryRate,
  });

  const selectedStrategyConfig =
    selectedStrategy === "custom"
      ? { ...DEFAULT_CUSTOM_STRATEGY, ...customStrategy }
      : STRATEGY_MAP[selectedStrategy];

  const baseline = useMemo(
    () =>
      calculateSimulation(inputs, {
        key: "baseline",
        label: "Baseline",
        approvalDelta: 0,
        fraudDelta: 0,
        recoveryRate: inputs.declineRecoveryRate,
      }),
    [inputs]
  );

  const selected = useMemo(
    () => calculateSimulation(inputs, selectedStrategyConfig),
    [inputs, selectedStrategyConfig]
  );

  const sensitivity = useMemo(() => buildSensitivitySeries(inputs), [inputs]);

  const predefinedResults = useMemo(() => {
    return STRATEGIES.reduce(
      (acc, strategy) => {
        acc[strategy.key] = calculateSimulation(inputs, strategy);
        return acc;
      },
      {} as Record<string, ReturnType<typeof calculateSimulation>>
    );
  }, [inputs]);

  const bestPredefined = getBestStrategyKey(predefinedResults);
  const bestStrategyLabel = bestPredefined
    ? STRATEGY_MAP[bestPredefined.key as StrategyKey].label
    : "Balanced";

  const sortedPredefined = Object.entries(predefinedResults).sort(
    (a, b) => b[1].netProfit - a[1].netProfit
  );
  const top = sortedPredefined[0];
  const runnerUp = sortedPredefined[1];
  const profitGap = runnerUp ? top[1].netProfit - runnerUp[1].netProfit : 0;
  const profitGapPct =
    top && top[1].netProfit !== 0 ? profitGap / Math.abs(top[1].netProfit) : 0;

  const customBeatsBest =
    selectedStrategy === "custom" && bestPredefined && selected.netProfit > bestPredefined.netProfit * 1.02;
  const topFraudRate = top ? top[1].fraudRate : 0;
  const topFraudDelta = top ? top[1].fraudRate - baseline.fraudRate : 0;
  const topMargin = top && top[1].approvedVolume > 0 ? top[1].netProfit / top[1].approvedVolume : 0;

  const clusteredOutcomes = profitGapPct < 0.015 || profitGap < 2500;
  const elevatedFraud = topFraudRate >= Math.max(2.5, baseline.fraudRate + 1);
  const thinMargin = topMargin > 0 && topMargin < 0.02;
  const needsTuning = clusteredOutcomes || (elevatedFraud && thinMargin);

  const recommendationKey = customBeatsBest
    ? "custom"
    : needsTuning
      ? "custom"
      : bestPredefined?.key ?? "balanced";
  const recommendationLabel = getRecommendationLabel(recommendationKey);
  const recommendationRationale = customBeatsBest
    ? "Custom tuning outperforms the preset strategies on net profit. The gap is large enough to justify iterative optimization."
    : needsTuning
      ? "Preset strategies are closely clustered or require elevated fraud exposure with thin margins. Custom tuning can improve the risk-adjusted outcome."
      : `${bestStrategyLabel} delivers the highest net profit among preset strategies with an acceptable fraud exposure shift of ${topFraudDelta.toFixed(
          1
        )}pp.`;

  const insights = generateInsights({
    baseline,
    selected,
    selectedStrategy: selectedStrategyConfig,
    bestStrategyLabel,
    bestStrategyKey: bestPredefined?.key ?? "balanced",
  });

  const resetDefaults = () => {
    setInputs(defaultPreset.inputs);
    setActivePresetKey(defaultPreset.key);
    setSelectedStrategy("balanced");
    setCustomStrategy({
      approvalDelta: DEFAULT_CUSTOM_STRATEGY.approvalDelta,
      fraudDelta: DEFAULT_CUSTOM_STRATEGY.fraudDelta,
      recoveryRate: DEFAULT_CUSTOM_STRATEGY.recoveryRate,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Payment Approval Optimization Simulator</h1>
              <Badge>Portfolio case study</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Stress-test approval, fraud exposure, and profit trade-offs in card payments.
            </p>
          </div>
          <Button variant="outline" onClick={resetDefaults}>
            Reset to default scenario
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 sm:px-6 lg:py-8">
        <PresetSelector
          presets={MERCHANT_PRESETS}
          activePresetKey={activePresetKey}
          onSelect={(preset) => {
            setInputs(preset.inputs);
            setActivePresetKey(preset.key);
          }}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <InputPanel inputs={inputs} onChange={setInputs} />
          <StrategySelector
            strategies={STRATEGIES}
            selectedKey={selectedStrategy}
            customValues={customStrategy}
            onSelect={setSelectedStrategy}
            onCustomChange={(values) => {
              setCustomStrategy(values);
              setSelectedStrategy("custom");
            }}
          />
        </div>

        <KpiCards results={selected} />

        <ComparisonTable baseline={baseline} selected={selected} selectedLabel={selectedStrategyConfig.label} />

        <ProfitChart
          baseline={baseline}
          selected={selected}
          selectedLabel={selectedStrategyConfig.label}
          sensitivity={sensitivity}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <InsightsPanel insights={insights} />
          <RecommendationBox recommendation={recommendationLabel} rationale={recommendationRationale} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Model assumptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>This is a directional simulation for portfolio and learning use only.</p>
            <p>
              Real payment performance depends on issuer behavior, scheme rules, MCC, geography,
              fraud mix, and retry/soft-decline logic.
            </p>
            <p>
              Use results to understand trade-offs between conversion, fraud exposure, and margin
              pressure, not as operational truth.
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-6xl px-6 text-xs text-slate-500">
          Built as a fintech simulation project for portfolio use.
        </div>
      </footer>
    </div>
  );
}
