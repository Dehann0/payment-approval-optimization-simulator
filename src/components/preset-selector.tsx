import { MerchantPreset } from "@/types/simulation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/formatters";

interface PresetSelectorProps {
  presets: MerchantPreset[];
  activePresetKey?: string;
  onSelect: (preset: MerchantPreset) => void;
}

export function PresetSelector({ presets, activePresetKey, onSelect }: PresetSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant profiles</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Load realistic baseline inputs to anchor the scenario.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {presets.map((preset) => (
          <div
            key={preset.key}
            className={`rounded-lg border px-4 py-3 ${
              activePresetKey === preset.key
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="text-sm font-semibold text-slate-900">{preset.label}</div>
            <p className="mt-1 text-xs text-slate-500">{preset.description}</p>
            <div className="mt-2 text-xs text-slate-600">
              {formatNumber(preset.inputs.transactionCount)} txns · {formatCurrency(preset.inputs.averageTicket)} AOV
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {formatPercent(preset.inputs.approvalRate)} approval · {formatPercent(preset.inputs.fraudRate)} fraud
            </div>
            <Button
              className="mt-3 w-full"
              size="sm"
              variant={activePresetKey === preset.key ? "default" : "secondary"}
              onClick={() => onSelect(preset)}
            >
              Load preset
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
