# Payment Approval Optimization Simulator

A portfolio-grade fintech simulation that demonstrates the trade-off between approval rate and fraud exposure. The product is designed for internship or product case study reviews, showing how changes in risk posture affect revenue, cost, and net profit.

## Product intent

- Educate on the principle: higher approval rate is not always better
- Make trade-offs visible through KPIs, comparisons, and charts
- Provide a decision-oriented recommendation rooted in net profit

## Features

- Merchant input panel with realistic defaults and presets
- Strict / Balanced / Aggressive strategies plus custom tuning
- KPI dashboard for volume, fraud loss, fees, and profitability
- Baseline vs strategy comparison view
- Recharts visualizations for profit and rate sensitivity
- Insight engine and recommendation logic based on net profit
- Clear simulation assumptions and disclaimers

## Strategy presets

- **Strict**: lower approvals, lower fraud
- **Balanced**: modest approval lift, contained fraud
- **Aggressive**: higher approvals, higher fraud exposure

## Merchant presets

- Subscription SaaS (Low Risk)
- Marketplace Retail (Mid Risk)
- Digital Goods & Gaming (High Risk)

## Core formulas

All rates are stored as percentages and converted to decimals for math.

- `attemptedVolume = transactionCount * averageTicket`
- `approvedTransactions = transactionCount * approvalRate`
- `declinedTransactions = transactionCount - approvedTransactions`
- `recoveredTransactions = declinedTransactions * recoveryRate`
- `approvedVolume = approvedTransactions * averageTicket`
- `fraudulentTransactions = approvedTransactions * fraudRate`
- `fraudLoss = fraudulentTransactions * averageTicket`
- `chargebackOperationalCost = fraudulentTransactions * chargebackCost`
- `processingCost = approvedVolume * processingFeeRate`
- `refundLoss = approvedVolume * refundRate`
- `merchantRevenue = approvedVolume * merchantMarginRate`
- `netRevenueBeforeFraud = merchantRevenue - processingCost - refundLoss`
- `netProfit = netRevenueBeforeFraud - fraudLoss - chargebackOperationalCost`

## Recommendation logic (high level)

- Picks the highest net profit among preset strategies
- Flags when outcomes are clustered and suggests custom tuning
- Escalates to custom tuning when profit margins are thin or fraud is elevated

## Assumptions

- This is a simulation and not a real payment system.
- Metrics are illustrative and directional only.
- Real performance depends on issuer behavior, scheme rules, MCC, geography, fraud mix, and risk engine quality.
- Fraud rates for preset strategies are capped at 10% for realism (custom strategies can exceed this).

## Tech stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- shadcn/ui-style components

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Possible future improvements

- Scenario export and sharing
- Strategy optimization grid search
- Support for issuer mix, MCC, and geo segments
- Monte Carlo simulations for fraud variance
- Persistence with a lightweight database

Built as a fintech simulation project for portfolio use.
