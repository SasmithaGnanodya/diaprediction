/**
 * Represents patient data required for diabetes risk prediction.
 */
export interface PatientData {
  /**
   * The patient's age in years.
   */
  age: number;
  /**
   * The patient's blood group (e.g., A+, O-).
   */
  bloodGroup: string;
  /**
   * The patient's gender (Male or Female).
   */
  gender: string;
  /**
   * The patient's weight in kilograms.
   */
  weight: number;
  /**
   * The patient's height in centimeters.
   */
  height: number;
}

/**
 * Represents the diabetes risk prediction result.
 */
export interface DiabetesPrediction {
  /**
   * The probability of a positive diabetes diagnosis (0 to 1).
   */
  probability: number;
  /**
   * A confidence level indicator (e.g., High, Medium, Low).
   */
  confidence: string;
}

/**
 * Asynchronously predicts the probability of diabetes based on patient data.
 * This function is now primarily handled by the AI flow.
 * It's kept here for type definitions and potential future non-AI implementations.
 *
 * @param patientData The patient data used for prediction.
 * @returns A promise that resolves to a DiabetesPrediction object.
 */
export async function predictDiabetes(patientData: PatientData): Promise<DiabetesPrediction> {
  // The actual prediction logic is now within the Genkit AI flow (`src/ai/flows/predict-diabetes.ts`).
  // This function signature remains for type safety and consistency.
  // If needed, a non-AI fallback or direct API call could be added here later.
  console.warn("predictDiabetes function called directly, but logic resides in the AI flow.");

  // Returning a default/dummy response as the primary logic is in the AI flow.
  // This should ideally not be reached if the AI flow is working correctly.
  return {
    probability: 0.0, // Default/placeholder
    confidence: 'Low', // Default/placeholder
  };
}
