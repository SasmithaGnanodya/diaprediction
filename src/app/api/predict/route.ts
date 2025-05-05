'use server';
/**
 * @fileOverview API route for diabetes prediction.
 * Handles POST requests to /api/predict with patient data and returns the prediction result.
 */

import { NextResponse } from 'next/server';
import { predictDiabetesProbability } from '@/ai/flows/predict-diabetes';
import type { PredictDiabetesOutput } from '@/ai/flows/predict-diabetes';
import { z } from 'zod';

// Define the input schema directly in the API route, mirroring the one in the flow
// This is necessary because Zod schemas cannot be exported from 'use server' files.
const PredictDiabetesInputSchema = z.object({
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }).max(120, { message: "Age seems unrealistic." }).int("Age must be a whole number.").describe("The patient's age in years."),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }).describe("The patient's blood group (e.g., A+, O-)."),
  gender: z.string().describe("The patient's gender (Male, Female, or Other)."),
  weight: z.coerce.number().min(1, { message: "Weight must be positive." }).max(500, { message: "Weight seems unrealistic."}).describe("The patient's weight in kilograms."),
  height: z.coerce.number().min(50, { message: "Height must be at least 50cm." }).max(250, { message: "Height seems unrealistic."}).int("Height must be a whole number (cm).").describe("The patient's height in centimeters."),
});


/**
 * Handles POST requests for diabetes prediction.
 * Expects a JSON body matching the PredictDiabetesInput schema.
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse object with the prediction result or an error.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against the Zod schema defined in this file
    const validationResult = PredictDiabetesInputSchema.safeParse(body);

    if (!validationResult.success) {
      // If validation fails, return a 400 Bad Request with Zod error details
      return NextResponse.json({ error: 'Invalid input data', details: validationResult.error.format() }, { status: 400 });
    }

    // Call the Genkit flow function with the validated data
    // The flow function still expects data matching the PredictDiabetesInput type.
    const prediction: PredictDiabetesOutput = await predictDiabetesProbability(validationResult.data);

    // Return the prediction result with a 200 OK status
    return NextResponse.json(prediction, { status: 200 });

  } catch (error) {
    // Handle potential errors during request processing or the AI call
    console.error("API Prediction Error:", error);

    // Check if the error is a Zod validation error (should be caught above, but as a fallback)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.format() }, { status: 400 });
    }

    // Generic error handler for other issues (e.g., AI service unavailable)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: 'Failed to get prediction', details: errorMessage }, { status: 500 });
  }
}

/**
 * Handles GET requests (optional, provides usage info).
 * @returns A NextResponse object explaining how to use the endpoint.
 */
export async function GET() {
    // Get example body from the schema default/description if possible or define manually
    const exampleBody = {
        age: PredictDiabetesInputSchema.shape.age.description?.includes("e.g.") ? parseInt(PredictDiabetesInputSchema.shape.age.description.split("e.g., ")[1]) : 50,
        bloodGroup: PredictDiabetesInputSchema.shape.bloodGroup.description?.includes("e.g.") ? PredictDiabetesInputSchema.shape.bloodGroup.description.split("e.g., ")[1].split(')')[0] : "O+",
        gender: "Male", // Example gender
        weight: PredictDiabetesInputSchema.shape.weight.description?.includes("e.g.") ? parseFloat(PredictDiabetesInputSchema.shape.weight.description.split("e.g., ")[1]) : 85,
        height: PredictDiabetesInputSchema.shape.height.description?.includes("e.g.") ? parseInt(PredictDiabetesInputSchema.shape.height.description.split("e.g., ")[1]) : 175,
    };

    return NextResponse.json({
        message: "Send a POST request to this endpoint with patient data in the JSON body to get a diabetes prediction.",
        requiredBodySchema: PredictDiabetesInputSchema.shape, // Provide schema shape
        exampleBody: exampleBody,
        responseFormat: {
            probability: "number (0-1)", // Describe types
            confidence: "'High' | 'Medium' | 'Low'" // Describe types
        }
    }, { status: 200 });
}
