'use client';

import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { PredictionForm, type PredictionFormData } from '@/components/prediction-form';
import { PredictionResult } from '@/components/prediction-result';
import { predictDiabetesProbability } from '@/ai/flows/predict-diabetes'; // Import the GenAI flow
import type { PredictDiabetesOutput } from '@/ai/flows/predict-diabetes'; // Use the correct output type
import { useToast } from "@/hooks/use-toast";
import { HeartPulse } from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // Import Separator

export default function PredictPage() {
  const [prediction, setPrediction] = useState<PredictDiabetesOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit: SubmitHandler<PredictionFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null); // Clear previous prediction

    try {
      // Call the GenAI flow function
      const result = await predictDiabetesProbability({
        age: data.age,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        weight: data.weight,
        height: data.height,
      });
      setPrediction(result);
      toast({
        title: "Prediction Successful",
        description: "Diabetes risk has been assessed.",
        variant: "default",
      });
    } catch (err) {
      console.error("Prediction failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during prediction.";
      setError(errorMessage);
      toast({
        title: "Prediction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 sm:p-12 bg-background">
       <header className="w-full max-w-5xl mb-10 text-center">
         {/* Removed redundant header elements, rely on global header */}
         <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Diabetes Risk Prediction</h1>
         <p className="text-lg text-muted-foreground">Enter patient details below for an AI-powered assessment.</p>
         <Separator className="my-6 w-1/4 mx-auto" />
      </header>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-start justify-center gap-12">
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <PredictionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start mt-8 lg:mt-0">
          {(isLoading || error || prediction) && (
             <PredictionResult prediction={prediction} isLoading={isLoading} error={error} />
          )}
          {/* Placeholder for when there's no result/loading/error */}
           {!isLoading && !error && !prediction && (
            <div className="w-full max-w-md h-96 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">
              Prediction results will appear here.
            </div>
           )}
        </div>
      </div>

       {/* Footer moved to layout.tsx */}
    </div>
  );
}
