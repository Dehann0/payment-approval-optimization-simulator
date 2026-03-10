import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightsPanelProps {
  insights: string[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product insights</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Interpretable takeaways for a payments or risk team.
        </p>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-sm text-slate-500">Adjust inputs to generate insights.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            {insights.map((insight, index) => (
              <li key={index} className="rounded-md bg-slate-50 px-3 py-2">
                {insight}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
