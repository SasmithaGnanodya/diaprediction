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
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Gender is required." }).describe("The patient's gender (Male, Female, or Other)."),
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
    // Ensure the request body is JSON
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content type, expected application/json' }, { status: 415 });
    }

    const body = await request.json();

    // Validate the request body against the Zod schema defined in this file
    const validationResult = PredictDiabetesInputSchema.safeParse(body);

    if (!validationResult.success) {
      // If validation fails, return a 400 Bad Request with detailed Zod error issues
      console.error("API Validation Error:", validationResult.error.flatten());
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Call the Genkit flow function with the validated data
    // The flow function still expects data matching the PredictDiabetesInput type.
    const prediction: PredictDiabetesOutput = await predictDiabetesProbability(validationResult.data);

    // Return the prediction result with a 200 OK status
    return NextResponse.json(prediction, { status: 200 });

  } catch (error) {
    // Handle potential errors during request processing or the AI call
    console.error("API Prediction Error:", error);

    // Check if it's a JSON parsing error
     if (error instanceof SyntaxError && error.message.includes('JSON')) {
       return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
     }

    // Check if the error is a Zod validation error (should be caught above, but as a fallback)
    if (error instanceof z.ZodError) {
       console.error("API Zod Error (Fallback):", error.flatten());
      return NextResponse.json({ error: 'Invalid input data', details: error.flatten().fieldErrors }, { status: 400 });
    }

    // Generic error handler for other issues (e.g., AI service unavailable)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: 'Failed to get prediction', details: errorMessage }, { status: 500 });
  }
}

/**
 * Handles GET requests to provide API usage information.
 * Returns a JSON response detailing how to use the POST endpoint.
 * @returns A NextResponse object explaining the API usage.
 */
export async function GET() {
    // Generate a more dynamic example based on schema defaults or descriptions
    const exampleBody = Object.fromEntries(
      Object.entries(PredictDiabetesInputSchema.shape).map(([key, fieldSchema]) => {
        let exampleValue: any;
        const desc = (fieldSchema as z.ZodTypeAny).description;
        const defaultValue = (fieldSchema as z.ZodTypeAny)._def.defaultValue?.();

        if (defaultValue !== undefined) {
           exampleValue = defaultValue;
        } else if (key === 'age') exampleValue = 50;
        else if (key === 'bloodGroup') exampleValue = 'O+';
        else if (key === 'gender') exampleValue = 'Female';
        else if (key === 'weight') exampleValue = 75.5;
        else if (key === 'height') exampleValue = 165;
        else exampleValue = `example_${key}`;

        return [key, exampleValue];
      })
    );

    // Describe the schema structure more clearly
    const schemaDescription = Object.fromEntries(
      Object.entries(PredictDiabetesInputSchema.shape).map(([key, fieldSchema]) => {
        const typeName = (fieldSchema as z.ZodTypeAny)._def.typeName;
        let description = (fieldSchema as z.ZodTypeAny).description || `Type: ${typeName}`;
        if ((fieldSchema as z.ZodTypeAny).isOptional()) description += ' (Optional)';
        if ((fieldSchema as z.ZodTypeAny).isNullable()) description += ' (Nullable)';
        return [key, description];
      })
    );

    const responseFormatDescription = {
       probability: "number (0-1) - Estimated probability of diabetes.",
       confidence: "'High' | 'Medium' | 'Low' - AI's confidence level in the prediction."
    };

    return NextResponse.json({
        message: "DiaPredict API Endpoint.",
        usage: "Send a POST request to this endpoint with patient data in the JSON body to get a diabetes risk prediction.",
        requiredBodySchema: schemaDescription,
        exampleRequestBody: exampleBody,
        successResponseFormat: responseFormatDescription,
        errorResponseFormat: {
            error: "string - General error message.",
            details: "object | string - Specific error details (e.g., validation failures or internal error info)."
        }
    }, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Allow': 'GET, POST' // Indicate allowed methods
        }
     });
}

// Add handler for unsupported methods like PUT, DELETE, etc.
export async function OPTIONS(request: Request) {
 return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Content-Length': '0',
    },
  });
}

// Explicitly reject other methods
const UNSUPPORTED_METHODS = ['PUT', 'DELETE', 'PATCH', 'HEAD'];
export async function handler(request: Request) {
    if (UNSUPPORTED_METHODS.includes(request.method)) {
        return NextResponse.json({ error: `Method ${request.method} Not Allowed` }, {
             status: 405,
             headers: { 'Allow': 'GET, POST, OPTIONS' }
        });
    }
    // Fallback for any other unexpected method (should not happen with Next.js routing)
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

// Assign the handler to specific methods if needed, though Next.js handles this by exporting named functions
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
