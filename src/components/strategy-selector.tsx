import { StrategyConfig, StrategyKey } from "@/types/simulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomValues {
  approvalDelta: number;
  fraudDelta: number;
  recoveryRate: number;
}

interface StrategySelectorProps {
  strategies: StrategyConfig[];
  selectedKey: StrategyKey;
  customValues: CustomValues;
  onSelect: (key: StrategyKey) => void;
  onCustomChange: (values: CustomValues) => void;
}

const sliderClass =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900";

export function StrategySelector({
  strategies,
  selectedKey,
  customValues,
  onSelect,
  onCustomChange,
}: StrategySelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk strategy</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Adjust approval and fraud posture relative to the baseline.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-3">
          {strategies.map((strategy) => (
            <button
              key={strategy.key}
              className={`rounded-lg border px-4 py-3 text-left transition ${
                selectedKey === strategy.key
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              type="button"
              onClick={() => onSelect(strategy.key as StrategyKey)}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">{strategy.label}</div>
                <span className="text-xs text-slate-500">
                  {strategy.approvalDelta > 0 ? "+" : ""}
                  {strategy.approvalDelta}pp approval
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{strategy.description}</p>
              <div className="mt-2 text-xs text-slate-600">
                Fraud delta: {strategy.fraudDelta > 0 ? "+" : ""}
                {strategy.fraudDelta}pp · Recovery: {strategy.recoveryRate}%
              </div>
            </button>
          ))}
          <div
            className={`rounded-lg border px-4 py-3 ${
              selectedKey === "custom" ? "border-slate-900 bg-slate-50" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Custom strategy</div>
                <p className="text-xs text-slate-500">Fine-tune approval, fraud, and recovery.</p>
              </div>
              <Button
                size="sm"
                variant={selectedKey === "custom" ? "default" : "secondary"}
                onClick={() => onSelect("custom")}
              >
                Use custom
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Approval delta (pp)</Label>
                  <span className="text-xs text-slate-500">{customValues.approvalDelta}pp</span>
                </div>
                <input
                  className={sliderClass}
                  type="range"
                  min={-8}
                  max={8}
                  step={0.5}
                  value={customValues.approvalDelta}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      approvalDelta: Number(event.target.value),
                    })
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Fraud delta (pp)</Label>
                  <span className="text-xs text-slate-500">{customValues.fraudDelta}pp</span>
                </div>
                <input
                  className={sliderClass}
                  type="range"
                  min={-1.5}
                  max={2}
                  step={0.05}
                  value={customValues.fraudDelta}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      fraudDelta: Number(event.target.value),
                    })
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Recovery rate (%)</Label>
                  <span className="text-xs text-slate-500">{customValues.recoveryRate}%</span>
                </div>
                <input
                  className={sliderClass}
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={customValues.recoveryRate}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      recoveryRate: Number(event.target.value),
                    })
                  }
                />
              </div>
              <div className="text-xs text-slate-500">
                Keep fraud delta modest if approvals rise aggressively.
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">Model assumptions</div>
          <p className="text-xs text-slate-600">
            Strategies adjust approval and fraud rates relative to baseline. Recovery applies to
            declined transactions to simulate smart retry or orchestration logic.
          </p>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Approval delta range</span>
              <span>-8pp to +8pp</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fraud delta range</span>
              <span>-1.5pp to +2pp</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Recovery rate range</span>
              <span>0% to 25%</span>
            </div>
            <div className="rounded-md bg-white px-3 py-2 text-xs text-slate-500">
              Fraud rate is capped at 10% for preset strategies to keep outcomes realistic.
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customFraudGuard">Custom fraud ceiling (%)</Label>
            <Input
              id="customFraudGuard"
              value="No cap (custom)"
              readOnly
              className="bg-white text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
