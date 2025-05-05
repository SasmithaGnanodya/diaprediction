'use client';

import type { PredictDiabetesOutput } from '@/ai/flows/predict-diabetes'; // Updated type import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Activity, CheckCircle, Info } from 'lucide-react'; // Added CheckCircle, Info
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface PredictionResultProps {
  prediction: PredictDiabetesOutput | null;
  isLoading: boolean;
  error: string | null;
}

export function PredictionResult({ prediction, isLoading, error }: PredictionResultProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md shadow-xl bg-card border border-border rounded-xl animate-pulse"> {/* Added pulse animation */}
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Activity className="text-primary" />
            Analyzing Patient Data...
          </CardTitle>
          <CardDescription>Please wait for the assessment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pt-2 pb-6">
          <div className="flex justify-center items-baseline gap-2">
             <Skeleton className="h-12 w-20" />
             <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-3 w-full" />
           <div className="flex justify-center items-center gap-2">
             <Skeleton className="h-4 w-20" />
             <Skeleton className="h-6 w-16 rounded-full" />
           </div>
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md shadow-xl bg-destructive/10 border-destructive border rounded-xl"> {/* Use destructive theme */}
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-destructive font-semibold">
            <AlertCircle />
            Assessment Error
          </CardTitle>
          <CardDescription className="text-destructive/90">
            Could not complete the risk assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-0 pb-6">
          <p className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
     // This case is handled by the placeholder in page.tsx, return null here
    return null;
  }

  const probabilityPercentage = Math.round(prediction.probability * 100);
  const confidenceLevel = prediction.confidence;

  let confidenceColorClass = '';
  switch (confidenceLevel) {
    case 'High':
      confidenceColorClass = 'bg-green-600 text-white'; // Use Tailwind colors directly for simplicity here
      break;
    case 'Medium':
      confidenceColorClass = 'bg-yellow-500 text-yellow-900'; // Improved contrast
      break;
    case 'Low':
      confidenceColorClass = 'bg-red-500 text-white';
      break;
    default:
      confidenceColorClass = 'bg-muted text-muted-foreground';
  }

  return (
    <Card className="w-full max-w-md shadow-xl bg-card border border-border rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-2">
           <CheckCircle className="text-primary w-6 h-6"/> Risk Assessment Result
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-1">Likelihood of diabetes based on provided data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pt-2 pb-6">
        <div className="text-center">
          <p className="text-6xl font-bold text-primary">{probabilityPercentage}<span className="text-3xl font-semibold">%</span></p>
          <p className="text-base text-muted-foreground mt-1">Estimated Probability</p>
        </div>
        <Progress value={probabilityPercentage} className="w-full h-2 [&>*]:bg-primary" aria-label={`Diabetes probability: ${probabilityPercentage}%`} />
        <div className="flex justify-center items-center space-x-2 pt-2">
          <span className="text-sm font-medium text-foreground">AI Confidence:</span>
          <Badge variant="secondary" className={cn("px-3 py-0.5 text-xs font-semibold rounded-full border-none", confidenceColorClass)}>
            {confidenceLevel}
          </Badge>
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-foreground pt-4 border-t mt-6 pt-4">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Disclaimer: This AI-powered assessment provides an estimate based on limited data and general risk factors. It is not a substitute for a professional medical diagnosis. Always consult a qualified healthcare provider for any health concerns or decisions.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
