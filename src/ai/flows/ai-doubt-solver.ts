'use server';
/**
 * @fileOverview An AI academic tutor designed to solve student doubts.
 *
 * - aiDoubtSolver - A function that processes academic doubts via text or voice and provides explanations and solutions.
 * - AiDoubtSolverInput - The input type for the aiDoubtSolver function.
 * - AiDoubtSolverOutput - The return type for the aiDoubtSolver function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDoubtSolverInputSchema = z.object({
  doubtText: z.string().describe('The academic doubt submitted by the student.'),
  audioDataUri: z
    .string()
    .optional()
    .describe(
      "Optional audio input of the doubt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiDoubtSolverInput = z.infer<typeof AiDoubtSolverInputSchema>;

const AiDoubtSolverOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear and concise explanation of the academic concept or doubt.'),
  solution: z
    .string()
    .describe('A step-by-step solution to the academic problem, if applicable.'),
});
export type AiDoubtSolverOutput = z.infer<typeof AiDoubtSolverOutputSchema>;

export async function aiDoubtSolver(input: AiDoubtSolverInput): Promise<AiDoubtSolverOutput> {
  return aiDoubtSolverFlow(input);
}

const solveDoubtPrompt = ai.definePrompt({
  name: 'solveDoubtPrompt',
  input: {schema: AiDoubtSolverInputSchema},
  output: {schema: AiDoubtSolverOutputSchema},
  prompt: `You are an AI academic tutor designed to help students understand challenging concepts by providing clear, concise explanations and solutions.

The student has the following academic doubt:
Doubt: {{{doubtText}}}

{{#if audioDataUri}}
Additionally, please consider the audio input provided for further context: {{media url=audioDataUri}}
{{/if}}

Please provide a clear and concise explanation of the academic concept or doubt, and if applicable, a step-by-step solution. Ensure the explanation and solution are easy to understand for a student.`, 
});

const aiDoubtSolverFlow = ai.defineFlow(
  {
    name: 'aiDoubtSolverFlow',
    inputSchema: AiDoubtSolverInputSchema,
    outputSchema: AiDoubtSolverOutputSchema,
  },
  async input => {
    const {output} = await solveDoubtPrompt(input);
    return output!;
  },
);
