import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { Listing } from '../models/Listing';

const router = Router();
const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] ?? '' });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

router.post('/', async (req: Request, res: Response) => {
  const { messages }: { messages: ChatMessage[] } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  // Pull active listings for context
  const listings = await Listing.find({ isActive: true })
    .select('title address price bedrooms bathrooms distanceToUSC amenities description availableDate')
    .limit(40)
    .lean();

  const listingContext = listings.map((l) => {
    const parts = [
      `• ${l.title}`,
      `  Address: ${l.address}`,
      `  Price: $${l.price}/mo`,
      `  Beds/Baths: ${l.bedrooms}bd / ${l.bathrooms}ba`,
      l.distanceToUSC ? `  Distance to USC: ${l.distanceToUSC}` : null,
      l.amenities?.length ? `  Amenities: ${l.amenities.join(', ')}` : null,
      l.availableDate ? `  Available: ${new Date(l.availableDate).toLocaleDateString()}` : null,
    ].filter(Boolean);
    return parts.join('\n');
  }).join('\n\n');

  const systemPrompt = `You are a helpful housing assistant for DormSC, a USC student housing platform. You help students find off-campus housing near the University of Southern California (USC) in Los Angeles.

Here are the current active listings on DormSC:

${listingContext || 'No listings are currently available.'}

Guidelines:
- Answer questions about specific listings using only the data above
- Help students compare options by price, distance, beds/baths, or amenities
- Be concise and friendly — students are busy
- If asked about a listing not in the data above, say it may have been removed or is no longer active
- Do not make up details not present in the listing data
- Suggest visiting DormSC to see photos and full details
- USC is in University Park, Los Angeles, CA 90007`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

export default router;
