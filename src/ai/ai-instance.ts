import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error(
    'ERROR: GOOGLE_GENAI_API_KEY environment variable is not set. Please add it to your .env file.'
  );
  // Optionally, throw an error to prevent initialization if the key is critical
  // throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable.');
}

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: apiKey, // Use the checked apiKey variable
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
  logLevel: 'debug', // Add debug logging
});
