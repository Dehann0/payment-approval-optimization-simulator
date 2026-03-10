import { MerchantInputs } from "@/types/simulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputPanelProps {
  inputs: MerchantInputs;
  onChange: (values: MerchantInputs) => void;
}

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function InputPanel({ inputs, onChange }: InputPanelProps) {
  const updateField = (key: keyof MerchantInputs, value: string) => {
    onChange({ ...inputs, [key]: toNumber(value) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant input assumptions</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Use monthly volumes and baseline rates to define the starting state.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="transactionCount">Monthly transaction attempts</Label>
          <Input
            id="transactionCount"
            type="number"
            value={inputs.transactionCount}
            onChange={(event) => updateField("transactionCount", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="averageTicket">Average order value (AOV)</Label>
          <Input
            id="averageTicket"
            type="number"
            step="0.01"
            value={inputs.averageTicket}
            onChange={(event) => updateField("averageTicket", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approvalRate">Baseline approval rate (%)</Label>
          <Input
            id="approvalRate"
            type="number"
            step="0.1"
            value={inputs.approvalRate}
            onChange={(event) => updateField("approvalRate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fraudRate">Fraud rate on approved (%)</Label>
          <Input
            id="fraudRate"
            type="number"
            step="0.01"
            value={inputs.fraudRate}
            onChange={(event) => updateField("fraudRate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="processingFeeRate">Processing fee rate (%)</Label>
          <Input
            id="processingFeeRate"
            type="number"
            step="0.01"
            value={inputs.processingFeeRate}
            onChange={(event) => updateField("processingFeeRate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chargebackCost">Chargeback ops cost (per fraud)</Label>
          <Input
            id="chargebackCost"
            type="number"
            step="0.01"
            value={inputs.chargebackCost}
            onChange={(event) => updateField("chargebackCost", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="refundRate">Refund rate on approved (%)</Label>
          <Input
            id="refundRate"
            type="number"
            step="0.01"
            value={inputs.refundRate}
            onChange={(event) => updateField("refundRate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="declineRecoveryRate">Baseline decline recovery (%)</Label>
          <Input
            id="declineRecoveryRate"
            type="number"
            step="0.1"
            value={inputs.declineRecoveryRate}
            onChange={(event) => updateField("declineRecoveryRate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="merchantMarginRate">Merchant gross margin (%)</Label>
          <Input
            id="merchantMarginRate"
            type="number"
            step="0.1"
            value={inputs.merchantMarginRate}
            onChange={(event) => updateField("merchantMarginRate", event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
