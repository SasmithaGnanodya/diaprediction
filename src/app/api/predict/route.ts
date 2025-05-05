'use server';
/**
 * @fileOverview API route for diabetes prediction.
 * Handles POST requests to /api/predict with patient data and returns the prediction result.
 */

import { NextResponse } from 'next/server';
import { predictDiabetesProbability, PredictDiabetesInputSchema, PredictDiabetesOutput } from '@/ai/flows/predict-diabetes';
import { z } from 'zod';

/**
 * Handles POST requests for diabetes prediction.
 * Expects a JSON body matching the PredictDiabetesInput schema.
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse object with the prediction result or an error.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against the Zod schema
    const validationResult = PredictDiabetesInputSchema.safeParse(body);

    if (!validationResult.success) {
      // If validation fails, return a 400 Bad Request with Zod error details
      return NextResponse.json({ error: 'Invalid input data', details: validationResult.error.format() }, { status: 400 });
    }

    // Call the Genkit flow function with the validated data
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
    return NextResponse.json({
        message: "Send a POST request to this endpoint with patient data in the JSON body to get a diabetes prediction.",
        exampleBody: {
            age: 50,
            bloodGroup: "O+",
            gender: "Male",
            weight: 85,
            height: 175
        },
        responseFormat: {
            probability: 0.0, // Number between 0 and 1
            confidence: "Low" // "High", "Medium", or "Low"
        }
    }, { status: 200 });
}
