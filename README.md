# Payment Approval Optimization Simulator

A portfolio-grade **fintech simulation dashboard** that models the trade-off between **approval rate, fraud exposure, and risk-adjusted profitability** in card payments.

The simulator demonstrates how changes in **risk posture** affect:

- approval rate
- fraud losses
- payment volume
- net profit

Built as a **product-oriented learning project** exploring payment infrastructure and risk decisioning.

---

# Product Intent

The simulator illustrates a core principle in payment systems:

> Increasing approval rate does not always improve profitability.

A small increase in conversion may appear positive, but when **fraud losses, refunds, and operational costs** are included, the outcome can change significantly.

This tool makes those trade-offs visible through:

- KPI dashboards  
- strategy comparisons  
- profit sensitivity charts  
- automated insights and recommendations  

---

# Key Features

### Merchant Simulation Inputs

- Transaction volume  
- Average order value (AOV)  
- Baseline approval rate  
- Fraud rate (on approved transactions)  
- Decline recovery rate  
- Processing fee rate  
- Chargeback operational cost  
- Merchant margin  

### Risk Posture Strategies

- **Strict** → lower approval, lower fraud exposure  
- **Balanced** → moderate approval lift with controlled fraud  
- **Aggressive** → higher approval with higher fraud exposure  
- **Custom tuning** → manual adjustment of risk parameters  

### Decision Analytics

- KPI dashboard for payment volume and profitability  
- Baseline vs strategy comparison table  
- Approval vs fraud trade-off chart  
- Profit sensitivity visualization  
- Insight engine highlighting risk and conversion trade-offs  
- Recommendation engine based on **risk-adjusted profitability**

---

# Merchant Presets

The simulator includes example merchant profiles reflecting different risk environments.

| Merchant Type | Risk Profile |
|---|---|
| Subscription SaaS | Low fraud environment |
| Marketplace Retail | Medium fraud exposure |
| Digital Goods & Gaming | High fraud exposure |

These presets demonstrate how **payment economics vary across business models**.

---

# Core Model

All rates are stored as percentages and converted to decimals during calculations.

```
attemptedVolume = transactionCount * averageTicket
approvedTransactions = transactionCount * approvalRate
declinedTransactions = transactionCount - approvedTransactions

recoveredTransactions = declinedTransactions * recoveryRate

approvedVolume = approvedTransactions * averageTicket

fraudulentTransactions = approvedTransactions * fraudRate
fraudLoss = fraudulentTransactions * averageTicket

chargebackOperationalCost = fraudulentTransactions * chargebackCost

processingCost = approvedVolume * processingFeeRate
refundLoss = approvedVolume * refundRate

merchantRevenue = approvedVolume * merchantMarginRate

netRevenueBeforeFraud = merchantRevenue - processingCost - refundLoss
netProfit = netRevenueBeforeFraud - fraudLoss - chargebackOperationalCost
```

---

# Recommendation Logic

The simulator evaluates strategies based on **net profit**, not simply approval rate.

Decision logic includes:

- Selecting the strategy with the highest net profit  
- Detecting clustered outcomes across strategies  
- Suggesting custom tuning when margins are thin  
- Highlighting cases where higher approval harms profitability  

---

# Assumptions

This simulator is designed for **educational and portfolio purposes**.

Important limitations:

- This is **not a real payment system**  
- Metrics are **illustrative and directional only**

Real payment performance depends on:

- issuer behavior  
- card network rules (scheme rules)  
- merchant category code (MCC)  
- geography  
- fraud mix  
- risk engine quality  

Preset fraud rates are capped at **10% for realism**.

---

# Tech Stack

- **Next.js 14** (App Router)  
- **TypeScript**  
- **Tailwind CSS**  
- **Recharts**  
- **shadcn-style UI components**

---

# Run Locally

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Open the app:

```
http://localhost:3000
```

---

# Possible Future Improvements

- Scenario export and sharing  
- Strategy optimization grid search  
- Support for issuer mix and MCC segmentation  
- Geographic fraud risk modeling  
- Monte Carlo simulations for fraud variance  
- Data persistence using a lightweight database  

---

# Portfolio Context

This project was built as a **fintech product exploration** focused on:

- payment infrastructure  
- fraud vs conversion trade-offs  
- risk-adjusted profitability  
- decision-oriented dashboards  

---

Built as a **fintech simulation project for portfolio use.**
