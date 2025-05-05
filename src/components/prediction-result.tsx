'use client';

import type { DiabetesPrediction } from '@/services/diabetes-prediction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionResultProps {
  prediction: DiabetesPrediction | null;
  isLoading: boolean;
  error: string | null;
}

export function PredictionResult({ prediction, isLoading, error }: PredictionResultProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-primary animate-pulse" />
            Analyzing Data...
          </CardTitle>
          <CardDescription>Please wait while we process the patient information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle />
            Prediction Error
          </CardTitle>
          <CardDescription className="text-destructive">
            An error occurred while predicting diabetes risk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return null; // Don't render anything if there's no prediction, error, or loading state
  }

  const probabilityPercentage = Math.round(prediction.probability * 100);
  const confidenceColor = prediction.confidence === 'High' ? 'bg-green-500' : prediction.confidence === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="w-full max-w-md shadow-lg bg-card border border-border rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Prediction Result</CardTitle>
        <CardDescription className="text-muted-foreground">Likelihood of positive diabetes diagnosis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-5xl font-extrabold text-primary">{probabilityPercentage}%</p>
          <p className="text-lg text-muted-foreground">Probability</p>
        </div>
        <Progress value={probabilityPercentage} className="w-full h-3 [&>*]:bg-primary" aria-label={`Diabetes probability: ${probabilityPercentage}%`} />
        <div className="flex justify-center items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Confidence Level:</span>
          <Badge variant="secondary" className={`px-3 py-1 text-xs font-semibold rounded-full ${confidenceColor} text-white`}>
            {prediction.confidence}
          </Badge>
        </div>
        <p className="text-xs text-center text-muted-foreground pt-4">
          Disclaimer: This prediction is based on AI analysis and should not replace professional medical advice. Consult a healthcare provider for diagnosis.
        </p>
      </CardContent>
    </Card>
  );
}
