'use server';
/**
 * @fileOverview A diabetes prediction AI agent.
 *
 * - predictDiabetesProbability - A function that handles the diabetes prediction process.
 * - PredictDiabetesInput - The input type for the predictDiabetesProbability function.
 * - PredictDiabetesOutput - The return type for the predictDiabetesProbability function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
// Keep types from the service file, but the implementation logic is now primarily within the flow.
import type { PatientData, DiabetesPrediction } from '@/services/diabetes-prediction';

const PredictDiabetesInputSchema = z.object({
  age: z.number().describe("The patient's age in years."),
  bloodGroup: z.string().describe("The patient's blood group (e.g., A+, O-)."),
  gender: z.string().describe("The patient's gender (Male, Female, or Other)."),
  weight: z.number().describe("The patient's weight in kilograms."),
  height: z.number().describe("The patient's height in centimeters."),
});
export type PredictDiabetesInput = z.infer<typeof PredictDiabetesInputSchema>;

const PredictDiabetesOutputSchema = z.object({
  probability: z.number().min(0).max(1).describe('The probability of a positive diabetes diagnosis (0 to 1).'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('A confidence level indicator (High, Medium, Low).'),
});
export type PredictDiabetesOutput = z.infer<typeof PredictDiabetesOutputSchema>;

// This is the main function the UI will call
export async function predictDiabetesProbability(
  input: PredictDiabetesInput
): Promise<PredictDiabetesOutput> {
  return predictDiabetesFlow(input);
}

// Define the prompt for the AI model
const predictDiabetesPrompt = ai.definePrompt({
  name: 'predictDiabetesPrompt',
  input: {
    schema: PredictDiabetesInputSchema,
  },
  output: {
    schema: PredictDiabetesOutputSchema,
  },
  prompt: `Act as an expert medical AI specializing in diabetes risk assessment.
  Analyze the following patient data to predict the probability of a positive diabetes diagnosis.
  Consider common risk factors associated with these metrics.

  Patient Data:
  - Age: {{{age}}} years
  - Blood Group: {{{bloodGroup}}}
  - Gender: {{{gender}}}
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm

  Calculate the Body Mass Index (BMI) using the formula: weight (kg) / (height (m))^2. Height in meters is height (cm) / 100.
  BMI = ${"{{{ weight }}} / (({{{ height }}} / 100) ** 2)"}

  Based on the age, gender, and calculated BMI, estimate the probability of diabetes.
  - Higher age generally increases risk.
  - Higher BMI significantly increases risk (e.g., BMI > 25 increases risk, BMI > 30 significantly increases risk).
  - Consider gender nuances if relevant medical literature suggests. Blood group is less directly correlated but include it in context.

  Output:
  Return a JSON object containing:
  1.  'probability': A numerical value between 0.0 and 1.0 representing the likelihood of diabetes.
  2.  'confidence': A string indicating your confidence in the prediction ('High', 'Medium', or 'Low'). Base confidence on how strongly the input factors point towards or against diabetes according to general medical knowledge. For example, very high BMI and advanced age might warrant 'High' confidence for a high probability. Normal BMI and young age might warrant 'High' confidence for a low probability. Ambiguous cases get 'Medium' or 'Low'.

  Example Output Format:
  {
    "probability": 0.65,
    "confidence": "Medium"
  }
  `,
});


// Define the Genkit flow
const predictDiabetesFlow = ai.defineFlow<
  typeof PredictDiabetesInputSchema,
  typeof PredictDiabetesOutputSchema
>({
  name: 'predictDiabetesFlow',
  inputSchema: PredictDiabetesInputSchema,
  outputSchema: PredictDiabetesOutputSchema,
},
async input => {
  // Call the AI model with the defined prompt and input data
  const result = await predictDiabetesPrompt.generate({input});

  // Return the structured output from the AI
  return result.output();
});
