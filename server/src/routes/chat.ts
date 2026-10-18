import { Router, Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Listing } from '../models/Listing';
import { env } from '../lib/env';

const router = Router();
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many chat requests. Please try again in a few minutes.' },
});

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(1_000),
  })).min(1).max(12),
});

router.post('/', chatLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = chatSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0]?.message ?? 'Invalid chat messages' });
    return;
  }
  if (!openai) {
    res.status(503).json({ message: 'Chat is temporarily unavailable' });
    return;
  }

  const { messages } = parsed.data;

  try {
    // Pull active listings for context. Contact details are deliberately omitted.
    const listings = await Listing.find({ isActive: true })
      .select('title address price bedrooms bathrooms distanceToUSC amenities availableDate')
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
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      max_tokens: 700,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    });

    for await (const chunk of stream) {
      if (req.destroyed) break;
      const text = chunk.choices[0]?.delta?.content;
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    if (!res.writableEnded) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (err) {
    if (res.headersSent) {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: 'Chat response interrupted' })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }
      console.error('Chat stream error:', err);
      return;
    }
    next(err);
  }
});

export default router;
