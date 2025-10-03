import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateTextOptions {
  model?: string;
  instructions?: string;
  prompt: string;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
  maxTokens?: number;
  previousResponseId?: string;
}

interface GenerateTextResult {
  id: string;
  text: string;
}

export const llmClient = {
  async generateText({
    model = 'gpt-5-nano',
    instructions,
    prompt,
    reasoningEffort = 'minimal',
    maxTokens = 300,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    const response = await client.responses.create({
      model,
      instructions,
      input: prompt,
      reasoning: { effort: reasoningEffort },
      max_output_tokens: maxTokens,
      previous_response_id: previousResponseId,
    });

    return {
      id: response.id,
      text: response.output_text,
    };
  },
};
