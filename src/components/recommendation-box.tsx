import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecommendationBoxProps {
  recommendation: string;
  rationale: string;
}

export function RecommendationBox({ recommendation, rationale }: RecommendationBoxProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended posture</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          Based on net profit and risk trade-offs.
        </p>
      </CardHeader>
      <CardContent>
        <Badge className="mb-3">{recommendation}</Badge>
        <p className="text-sm text-slate-600">{rationale}</p>
      </CardContent>
    </Card>
  );
}
