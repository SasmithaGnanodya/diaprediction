'use client';

import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { PredictionForm, type PredictionFormData } from '@/components/prediction-form';
import { PredictionResult } from '@/components/prediction-result';
import { predictDiabetesProbability } from '@/ai/flows/predict-diabetes'; // Import the GenAI flow
import type { DiabetesPrediction } from '@/services/diabetes-prediction';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { HeartPulse } from 'lucide-react';


export default function Home() {
  const [prediction, setPrediction] = useState<DiabetesPrediction | null>(null);
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
        description: "Diabetes risk has been calculated.",
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-secondary">
       <div className="flex flex-col items-center mb-8 text-center">
         <HeartPulse className="w-16 h-16 text-primary mb-4" />
         <h1 className="text-4xl font-bold text-foreground mb-2">DiaPredict</h1>
         <p className="text-lg text-muted-foreground">AI-Powered Diabetes Risk Assessment</p>
        <Image
            src="https://picsum.photos/1200/400"
            alt="Healthcare technology banner"
            width={1200}
            height={400}
            className="mt-6 rounded-lg shadow-md object-cover w-full max-w-4xl h-48"
            data-ai-hint="healthcare technology abstract"
            priority // Load image faster
          />
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row items-start justify-center gap-8">
        <div className="w-full md:w-1/2">
          <PredictionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
          {(isLoading || error || prediction) && (
             <PredictionResult prediction={prediction} isLoading={isLoading} error={error} />
          )}
        </div>
      </div>

       <footer className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DiaPredict. All rights reserved. Built with Firebase Studio & Genkit.
      </footer>
    </main>
  );
}
