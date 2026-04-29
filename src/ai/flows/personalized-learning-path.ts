'use server';
/**
 * @fileOverview An AI agent that suggests personalized learning paths based on student performance and engagement.
 *
 * - personalizedLearningPath - A function that handles the personalized learning path generation process.
 * - PersonalizedLearningPathInput - The input type for the personalizedLearningPath function.
 * - PersonalizedLearningPathOutput - The return type for the personalizedLearningPath function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuizPerformanceSchema = z.object({
  topic: z.string().describe('The academic topic of the quiz.'),
  score: z.number().min(0).max(100).describe('The student\'s score on the quiz (0-100).'),
  weaknesses: z.array(z.string()).describe('Specific sub-topics or concepts where the student struggled in this quiz.'),
});

const EngagementDataSchema = z.object({
  topic: z.string().describe('The academic topic of the engaged content.'),
  contentType: z.string().describe('The type of content engaged with (e.g., "module", "textbook", "video", "quiz").'),
  progress: z.number().min(0).max(100).describe('The student\'s completion progress for this content (0-100%).'),
  timeSpentMinutes: z.number().min(0).describe('The time spent by the student on this content in minutes.'),
});

const PersonalizedLearningPathInputSchema = z.object({
  quizPerformance: z.array(QuizPerformanceSchema).describe('An array of the student\'s recent quiz performance records.'),
  engagementData: z.array(EngagementDataSchema).describe('An array of the student\'s learning engagement data.'),
});
export type PersonalizedLearningPathInput = z.infer<typeof PersonalizedLearningPathInputSchema>;

const RecommendedContentSchema = z.object({
  title: z.string().describe('The title of the recommended learning content (e.g., "Module on Quadratic Equations").'),
  type: z.string().describe('The type of content recommended (e.g., "module", "textbook_chapter", "video_lecture", "practice_set").'),
  topic: z.string().describe('The broader academic topic this content belongs to.'),
  reason: z.string().describe('A brief explanation of why this content is recommended.'),
});

const PersonalizedLearningPathOutputSchema = z.object({
  relevantTopics: z.array(z.string()).describe('A list of academic topics the student should focus on based on their performance.'),
  recommendedContent: z.array(RecommendedContentSchema).describe('A list of specific learning content recommendations.'),
  overallSummary: z.string().describe('A summary of the student\'s performance and the general strategy for improvement.'),
});
export type PersonalizedLearningPathOutput = z.infer<typeof PersonalizedLearningPathOutputSchema>;

export async function personalizedLearningPath(input: PersonalizedLearningPathInput): Promise<PersonalizedLearningPathOutput> {
  return personalizedLearningPathFlow(input);
}

const personalizedLearningPathPrompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: { schema: PersonalizedLearningPathInputSchema },
  output: { schema: PersonalizedLearningPathOutputSchema },
  prompt: `You are an AI assistant designed to help students optimize their learning journey by suggesting personalized topics and content.\n\nAnalyze the provided student data to identify areas of weakness and suggest relevant topics and specific learning content to improve understanding.\n\nHere is the student\'s recent quiz performance data:\n{{#if quizPerformance}}\n{{#each quizPerformance}}\n- Topic: {{{topic}}}, Score: {{{score}}}%. Weaknesses identified: {{#if weaknesses}}{{#each weaknesses}}- {{{this}}}{{/each}}{{else}}None recorded.{{/if}}\n{{/each}}\n{{else}}\nNo recent quiz performance data available.\n{{/if}}\n\nHere is the student\'s learning engagement data:\n{{#if engagementData}}\n{{#each engagementData}}\n- Topic: {{{topic}}}, Content Type: {{{contentType}}}, Progress: {{{progress}}}%, Time Spent: {{{timeSpentMinutes}}} minutes.\n{{/each}}\n{{else}}\nNo engagement data available.\n{{/if}}\n\nBased on this information, identify the academic topics where the student needs the most improvement. Then, recommend specific learning content (modules, textbook chapters, video lectures, practice sets, etc.) for those topics. Provide a clear reason for each recommendation.\n\nConsider the following:\n1. Topics with low quiz scores and identified weaknesses.\n2. Topics where engagement data shows low progress or insufficient time spent, especially if related to quiz weaknesses.\n3. Prioritize foundational topics if weaknesses suggest a gap in prerequisites.\n4. Ensure a balanced recommendation of different content types.\n5. Provide an overall summary of the student\'s performance and the general strategy for improvement.`,
});

const personalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'personalizedLearningPathFlow',
    inputSchema: PersonalizedLearningPathInputSchema,
    outputSchema: PersonalizedLearningPathOutputSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const { output } = await personalizedLearningPathPrompt(input);
        if (!output) throw new Error('No output from AI');
        return output;
      } catch (e: any) {
        attempts++;
        if (attempts >= maxAttempts) throw e;
        await new Promise((resolve) => setTimeout(resolve, attempts * 1500));
      }
    }
    throw new Error('Failed to generate learning path after retries');
  }
);
