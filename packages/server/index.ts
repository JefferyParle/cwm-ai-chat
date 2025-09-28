import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
import { conversationRepository } from './repositories/conversation.repository';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'hello world' });
});

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required.')
    .max(1000, 'Prompt is too long (max 1000)'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    const tree = z.treeifyError(parseResult.error);

    res.status(400).json(tree);
    return;
  }

  try {
    const { prompt, conversationId } = req.body;

    const response = await client.responses.create({
      model: 'gpt-5-nano',
      input: prompt,
      max_output_tokens: 100,
      reasoning: { effort: 'minimal' },
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    res.json({ message: response.output_text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate a response' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
