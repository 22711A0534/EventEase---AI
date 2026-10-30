import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { EventInput, EventPlan } from './src/types/event.js';
import { SAMPLE_WEDDING_PLAN, SAMPLE_BIRTHDAY_PLAN, SAMPLE_COMMUNITY_PLAN } from './src/data/samplePlans.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK
function getGeminiClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Persistent store for shared plans across sessions and server restarts
const SHARES_FILE = path.join(__dirname, 'shared_plans_store.json');
const sharedPlansMap = new Map<string, EventPlan>();

try {
  if (fs.existsSync(SHARES_FILE)) {
    const rawData = fs.readFileSync(SHARES_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);
    if (parsed && typeof parsed === 'object') {
      for (const [key, val] of Object.entries(parsed)) {
        sharedPlansMap.set(key, val as EventPlan);
      }
    }
  }
} catch (e) {
  console.warn('Could not initialize shared_plans_store.json from disk:', e);
}

const persistSharesToDisk = () => {
  try {
    const obj: Record<string, EventPlan> = {};
    sharedPlansMap.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(SHARES_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save shared plans to disk:', e);
  }
};

// API Routes
app.get('/api/sample-plans', (_req: Request, res: Response) => {
  res.json({
    wedding: SAMPLE_WEDDING_PLAN,
    birthday: SAMPLE_BIRTHDAY_PLAN,
    community: SAMPLE_COMMUNITY_PLAN,
  });
});

app.post('/api/share-plan', (req: Request, res: Response) => {
  try {
    const plan: EventPlan = req.body;
    if (!plan || !plan.input || !plan.input.title) {
      return res.status(400).json({ error: 'Valid event plan object is required' });
    }
    const cleanId = (plan.id || 'plan').replace(/[^a-zA-Z0-9_-]/g, '');
    const shareId = `share_${cleanId}_${Date.now().toString(36)}`;
    sharedPlansMap.set(shareId, plan);
    if (plan.id) {
      sharedPlansMap.set(plan.id, plan);
    }
    persistSharesToDisk();
    return res.json({ shareId, success: true });
  } catch (err: any) {
    console.error('Error sharing plan:', err);
    return res.status(500).json({ error: 'Failed to save shared plan' });
  }
});

app.get('/api/share-plan/:id', (req: Request, res: Response) => {
  const shareId = req.params.id;
  if (!shareId) {
    return res.status(400).json({ error: 'Share ID required' });
  }
  const plan = sharedPlansMap.get(shareId);
  if (!plan) {
    return res.status(404).json({ error: 'Shared plan not found or expired' });
  }
  return res.json(plan);
});

// Persistent Saved Plans endpoints across preview and published apps
app.get('/api/saved-plans', (_req: Request, res: Response) => {
  try {
    const list: EventPlan[] = [];
    const seenIds = new Set<string>();

    sharedPlansMap.forEach((plan, key) => {
      if (plan && plan.id && plan.input && !seenIds.has(plan.id)) {
        const title = (plan.input.title || '').toLowerCase();
        const isSample =
          plan.id.startsWith('sample-') ||
          title.includes('aanya') ||
          title.includes('ananya') ||
          title.includes('greenwood') ||
          (title.includes('aarav') && title.includes('maya'));

        if (!isSample) {
          seenIds.add(plan.id);
          list.push(plan);
        }
      }
    });

    return res.json(list);
  } catch (err) {
    console.error('Error getting saved plans:', err);
    return res.status(500).json({ error: 'Failed to retrieve saved plans' });
  }
});

app.post('/api/saved-plans', (req: Request, res: Response) => {
  try {
    const plan: EventPlan = req.body;
    if (!plan || !plan.id || !plan.input) {
      return res.status(400).json({ error: 'Valid plan object is required' });
    }
    sharedPlansMap.set(plan.id, plan);
    persistSharesToDisk();
    return res.json({ success: true, plan });
  } catch (err) {
    console.error('Error saving plan to server storage:', err);
    return res.status(500).json({ error: 'Failed to save plan to server' });
  }
});

app.delete('/api/saved-plans/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id) {
      sharedPlansMap.delete(id);
      persistSharesToDisk();
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('Error deleting plan from server storage:', err);
    return res.status(500).json({ error: 'Failed to delete plan from server' });
  }
});

app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const input: EventInput = req.body;

    if (!input || !input.eventType || !input.title || !input.budgetINR) {
      return res.status(400).json({ error: 'Missing required event fields (eventType, title, budgetINR)' });
    }

    const client = getGeminiClient();
    if (!client) {
      console.log('No Gemini API key available, using dynamic tailored fallback based on inputs');
      const fallbackPlan = generateHeuristicPlan(input);
      return res.json(fallbackPlan);
    }

    const prompt = `
You are EventEase AI, an elite event planner specializing in luxury & culturally authentic events in India and worldwide (Weddings, Birthdays, Community Festivals).
Generate a comprehensive, highly customized event plan in strict JSON format based on the following client details:

Event Type: ${input.eventType} (${input.subType || 'General'})
Event Title: "${input.title}"
Date: ${input.date || 'Upcoming'}
Time: ${input.time || 'Evening'}
Location: ${input.location || 'India'}
Guest Count: ${input.guestCount}
Total Budget: ₹${Number(input.budgetINR).toLocaleString('en-IN')} (Indian Rupees)
Preferences & Vibe: ${input.preferences ? input.preferences.join(', ') : 'Not specified'}
Special Notes: ${input.customNotes || 'None'}

REQUIREMENTS:
1. "budgetBreakdown": 6 to 8 realistic itemized categories. The sum of allocatedINR MUST equal ₹${input.budgetINR}. Each category needs an allocatedINR (number), percentage (number), priority ('Must-Have' | 'Recommended' | 'Optional'), a rich description tailored to ${input.location} and ${input.guestCount} guests, and an actionable moneySavingTip.
2. "timeline": 8 to 12 chronological tasks spanning phases: '6-12 Months Before', '3-6 Months Before', '1-2 Months Before', '2-3 Weeks Before', 'Week of Event', 'Event Day', 'Post-Event'. Include deadlineOffset and practical actionable description.
3. "vendorChecklist": 5 to 7 specific vendor types (e.g. Caterer, Photographer, Decorator, Venue, Sound/DJ, Anchor/Emcee, Makeup/Stylist, Return Favors). Include realistic estimatedCostINR string (e.g. "₹1,50,000 - ₹2,00,000"), importance ('Critical' | 'Important' | 'Optional'), 3 crucial questionsToAsk, and 3 deliverablesChecklist items.
4. "creativeIdeas":
   - "themes": Exactly 2 or 3 distinct, creative theme concepts. Each with name, tagline, description, colorPalette (3-4 swatches with name and hex color), vibeTags, and dressCode.
   - "decorSuggestions": 3 specific areas (e.g., Grand Entrance, Main Stage / Mandap, Photobooth / Lounge) with rich elements list.
   - "foodAndBeverage": welcomeDrinks (3 items), appetizers (4 items), mainCourseHighlights (4 items), dessertStations (3 items), cateringTips (2 tips). Tailor to ${input.location} and Indian culinary preferences.
   - "invitations": digitalCardCopy, whatsappMessageTemplate, formalInvitationText, designAestheticPrompt, rsvpDeadlineRecommendation.
5. "executiveSummary": A 2-3 sentence inspiring vision of the celebration.
6. "smartRecommendations": 3 expert insider tips specifically considering the budget of ₹${Number(input.budgetINR).toLocaleString('en-IN')} and ${input.guestCount} guests in ${input.location}.

Return ONLY valid JSON matching this schema. Do not include markdown code fences if possible, or wrap strictly in \`\`\`json.
`;

    const planModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let response: any = null;
    let lastPlanError: any = null;

    for (const model of planModels) {
      try {
        let timer: NodeJS.Timeout;
        const timeoutPromise = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Timeout with model ${model}`)), 25000);
        });
        const callPromise = client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: 'You are EventEase AI, the world-class event director. You produce realistic, budget-accurate (in Indian Rupees INR), culturally savvy and modern event masterplans. You output strictly valid JSON.',
            responseMimeType: 'application/json',
          },
        });
        response = await Promise.race([callPromise, timeoutPromise]);
        clearTimeout(timer!);
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastPlanError = err;
        console.warn(`Plan generation model ${model} failed:`, err?.message?.slice(0, 150));
      }
    }

    if (!response || !response.text) {
      throw lastPlanError || new Error('Failed to generate event plan from Gemini models');
    }

    let rawText = response.text || '';
    rawText = rawText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsedData = JSON.parse(rawText);
      const fullPlan: EventPlan = {
        id: 'plan-' + Date.now(),
        createdAt: new Date().toISOString(),
        input: input,
        executiveSummary: parsedData.executiveSummary || `A meticulously planned ${input.eventType} celebration for ${input.guestCount} guests in ${input.location}.`,
        budgetBreakdown: (parsedData.budgetBreakdown || []).map((b: any, idx: number) => ({
          id: 'b-' + (idx + 1),
          category: b.category || 'Category ' + (idx + 1),
          allocatedINR: Number(b.allocatedINR) || Math.round(input.budgetINR * (b.percentage || 10) / 100),
          percentage: Number(b.percentage) || 10,
          priority: b.priority || 'Must-Have',
          description: b.description || '',
          moneySavingTip: b.moneySavingTip || 'Compare 3 quotes before locking booking.',
          spentINR: 0,
          isBooked: false,
        })),
        timeline: (parsedData.timeline || []).map((t: any, idx: number) => ({
          id: 't-' + (idx + 1),
          phase: t.phase || '1-2 Months Before',
          title: t.title || 'Event Task ' + (idx + 1),
          description: t.description || '',
          deadlineOffset: t.deadlineOffset || 'Prior to event',
          category: t.category || 'General',
          isCompleted: false,
          priority: t.priority || 'medium',
        })),
        vendorChecklist: (parsedData.vendorChecklist || []).map((v: any, idx: number) => ({
          id: 'v-' + (idx + 1),
          category: v.category || 'Vendor ' + (idx + 1),
          estimatedCostINR: v.estimatedCostINR || 'Varies',
          importance: v.importance || 'Important',
          questionsToAsk: Array.isArray(v.questionsToAsk) ? v.questionsToAsk : ['Ask about availability and cancellation terms'],
          deliverablesChecklist: Array.isArray(v.deliverablesChecklist) ? v.deliverablesChecklist : ['Contract agreement and setup timing'],
          status: 'To Contact',
        })),
        creativeIdeas: parsedData.creativeIdeas || {
          themes: [],
          decorSuggestions: [],
          foodAndBeverage: { welcomeDrinks: [], appetizers: [], mainCourseHighlights: [], dessertStations: [], cateringTips: [] },
          invitations: { digitalCardCopy: '', whatsappMessageTemplate: '', formalInvitationText: '', designAestheticPrompt: '', rsvpDeadlineRecommendation: '' }
        },
        smartRecommendations: parsedData.smartRecommendations || [
          'Lock your core vendors early to protect against seasonal price escalations.',
          'Review guest dietary requirements 2 weeks before the caterer deadline.',
          'Designate an on-ground coordinator or trusted friend to manage day-of vendor arrivals.'
        ],
      };

      return res.json(fullPlan);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', parseErr, rawText);
      const fallbackPlan = generateHeuristicPlan(input);
      return res.json(fallbackPlan);
    }
  } catch (error: any) {
    console.error('Error generating event plan:', error);
    // Provide graceful dynamic fallback based on user inputs so the user always gets a rich response
    try {
      const fallbackPlan = generateHeuristicPlan(req.body);
      return res.json(fallbackPlan);
    } catch (e) {
      return res.status(500).json({ error: error.message || 'Internal server error generating plan' });
    }
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentPlan } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const latestUserMsg = messages[messages.length - 1]?.text?.trim() || '';
    if (!latestUserMsg) {
      return res.status(400).json({ error: 'A question or message is required' });
    }

    const client = getGeminiClient();
    
    // If client is not available, immediately provide context-aware plan fallback
    if (!client) {
      const fallbackReply = generateContextAwareChatFallback(latestUserMsg, currentPlan, { isOffline: true });
      return res.json({ reply: fallbackReply, isQuotaFallback: true });
    }

    let contextSnippet = 'No current event plan loaded.';
    if (currentPlan && currentPlan.input) {
      const input = currentPlan.input;
      contextSnippet = `
CURRENT EVENT DETAILS:
- Title: "${input.title}"
- Event Type: ${input.eventType}${input.subType ? ` (${input.subType})` : ''}
- Total Budget: ₹${Number(input.budgetINR || 0).toLocaleString('en-IN')} (Indian Rupees)
- Location: ${input.location || 'India'}
- Guest Count: ${input.guestCount} guests
- Planned Date: ${input.date || 'Upcoming'}
- Event Time: ${input.time || 'Not specified'}
- Preferences / Vibe: ${(input.preferences || []).join(', ') || 'Standard celebration'}
- Special Notes / Requirements: ${input.customNotes || 'None'}
`;
    }

    // Format recent conversation history (up to last 8 messages)
    const recentMessages = messages.slice(-8);
    const conversationHistory = recentMessages
      .map(m => `${m.sender === 'user' ? 'Client' : 'EventEase AI'}: ${m.text}`)
      .join('\n');

    const prompt = `
You are EventEase AI, an elite event planner and consultant specializing in weddings, birthday celebrations, and community festivals.
You understand Indian cultural nuances, venue & vendor negotiations, realistic budgeting in Indian Rupees (INR), timeline management, guest hospitality, and creative decor.

${contextSnippet}

CONVERSATION HISTORY:
${conversationHistory}

CLIENT'S CURRENT QUESTION:
"${latestUserMsg}"

RESPONSE GUIDELINES:
1. Directly and specifically answer the client's current question above. Do not provide generic or canned responses.
2. Directly refer to their actual event parameters (like their budget of ₹${currentPlan?.input?.budgetINR ? Number(currentPlan.input.budgetINR).toLocaleString('en-IN') : 'stated budget'}, ${currentPlan?.input?.guestCount || 'their'} guests, and location in ${currentPlan?.input?.location || 'India'}) where relevant.
3. If they ask about saving money, vendors, menus, speeches, games, or timeline, give concrete itemized suggestions and realistic Indian market costs.
4. Use clean markdown formatting with bold headings and bullet points for readability. Be warm, professional, actionable, and encouraging.
`;

    const chatModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let replyText = '';
    let lastError: any = null;

    for (const model of chatModels) {
      try {
        let timer: NodeJS.Timeout;
        const timeoutPromise = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Timeout with model ${model}`)), 20000);
        });
        const callPromise = client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: 'You are EventEase AI, a premier event consultant. Answer user queries with warmth, expert advice, budget-consciousness in INR, and practical tips. Output clear markdown.',
          },
        });
        const response: any = await Promise.race([callPromise, timeoutPromise]);
        clearTimeout(timer!);
        if (response && response.text) {
          replyText = response.text.trim();
          break;
        }
      } catch (mErr: any) {
        lastError = mErr;
        console.warn(`Model ${model} attempt failed:`, mErr?.message?.slice(0, 150));
      }
    }

    if (replyText) {
      return res.json({ reply: replyText, isQuotaFallback: false });
    }

    // If Gemini models encountered quota exhaustion, timeouts, or transient service errors,
    // gracefully provide an intelligent, context-aware local plan response without exposing stack traces.
    const errMsg = String(lastError?.message || '');
    const isQuota = errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('429') || errMsg.includes('quota');
    const isTimeout = errMsg.includes('Timeout') || errMsg.includes('timeout');

    const fallbackReply = generateContextAwareChatFallback(latestUserMsg, currentPlan, {
      isQuota,
      isTimeout
    });

    return res.json({
      reply: fallbackReply,
      isQuotaFallback: true,
      reason: isQuota ? 'quota_exhausted' : isTimeout ? 'timeout' : 'service_unavailable'
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err?.message || err);
    const errMsg = String(err?.message || '');
    const isQuota = errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('429') || errMsg.includes('quota');
    const isTimeout = errMsg.includes('Timeout') || errMsg.includes('timeout');

    try {
      const fallbackReply = generateContextAwareChatFallback(
        req.body?.messages?.slice(-1)[0]?.text || '',
        req.body?.currentPlan,
        { isQuota, isTimeout }
      );
      return res.json({ reply: fallbackReply, isQuotaFallback: true });
    } catch {
      return res.json({
        reply: `> ℹ️ **Notice**: *The Gemini AI free-tier limit has been reached for the moment. EventEase Assistant has switched to local plan-aware advisory mode based on your current event details. You can also try again later.*\n\nI am here to guide your celebration! Please feel free to ask about your budget breakdown, catering menus, vendor negotiations, or day-of run-sheets.`,
        isQuotaFallback: true
      });
    }
  }
});

// Context-aware dynamic fallback generator for AI Chat when free-tier quota is reached or service is unavailable
function generateContextAwareChatFallback(
  userQuestion: string,
  currentPlan: EventPlan | null,
  condition: { isQuota?: boolean; isTimeout?: boolean; isOffline?: boolean } = {}
): string {
  const plan = currentPlan;
  const input = plan?.input;
  const budgetINR = Number(input?.budgetINR || 50000);
  const guestCount = Math.max(Number(input?.guestCount || 50), 1);
  const title = input?.title || 'Your Event Celebration';
  const location = input?.location || 'your venue';
  const eventType = (input?.eventType || 'birthday').toLowerCase();
  const dateStr = input?.date || 'the scheduled date';
  const timeStr = input?.time || 'the scheduled time';

  // Construct clear, user-friendly notice without technical jargon or stack traces
  let noticeHeader = '';
  if (condition.isQuota) {
    noticeHeader = `> ℹ️ **Notice**: *The Gemini free-tier limit has been reached for the moment. EventEase Assistant has switched to local plan-aware advisory mode based on your current event details. You can also try again later.*\n\n`;
  } else if (condition.isTimeout) {
    noticeHeader = `> ℹ️ **Notice**: *The Gemini AI service is currently experiencing a delay. EventEase Assistant has provided this local plan-aware response using your active event details. You can also try again later.*\n\n`;
  } else {
    noticeHeader = `> ℹ️ **Notice**: *EventEase Assistant is operating in local plan-aware advisory mode using your current event details.*\n\n`;
  }

  const q = userQuestion.toLowerCase();

  // Intent classification
  const isBudget = /budget|cost|save|saving|rupee|inr|₹|\brs\b|expensive|cheap|cut|price|estimate|spend|allocation|breakdown|per plate|per guest|afford|discount|financial/i.test(q);
  const isFood = /food|cater|menu|dish|cuisine|buffet|lunch|dinner|snack|appetizer|starter|drink|beverage|mocktail|cocktail|cake|dessert|diet|veg|vegetarian|non-veg|jain|vegan|sweet|high tea|plate|dining/i.test(q);
  const isVendor = /vendor|negotiat|contract|photograph|candid|album|camera|video|cinematograph|film|dj|sound|music|band|magician|emcee|anchor|host|entertain|decorator|florist|flower|quote|booking|token|advance|clause|deliverable|payment terms/i.test(q);
  const isTimeline = /timeline|schedule|time|agenda|run sheet|run-of-show|order of event|program|timing|deadline|when|hour|sequence|duration|flow|order/i.test(q);
  const isDecor = /decor|theme|color|balloon|flower|floral|lighting|stage|backdrop|photo booth|photobooth|entry|arch|centerpiece|aesthetic|vibe|ambiance|styling/i.test(q);
  const isInviteOrSpeech = /invite|invitation|rsvp|whatsapp|message|card|wording|copy|speech|toast|welcome note|vote of thanks|script/i.test(q);

  // 1. BUDGET & COST GUIDANCE
  if (isBudget) {
    const perGuest = Math.round(budgetINR / guestCount);
    const cateringPortion = Math.round(budgetINR * 0.32);
    const venuePortion = Math.round(budgetINR * 0.30);
    const decorPortion = Math.round(budgetINR * 0.16);
    const photoPortion = Math.round(budgetINR * 0.10);
    const entertainmentPortion = Math.round(budgetINR * 0.07);
    const bufferPortion = Math.round(budgetINR * 0.05);

    let planBreakdownText = '';
    if (plan?.budgetBreakdown && plan.budgetBreakdown.length > 0) {
      planBreakdownText = `\n**Your Current Plan Allocations:**\n` +
        plan.budgetBreakdown.slice(0, 5).map(b => `- **${b.category}**: ₹${Number(b.allocatedINR).toLocaleString('en-IN')} (${b.percentage}%) — *${b.moneySavingTip || 'Compare quotes'}*`).join('\n') + '\n';
    }

    return `${noticeHeader}### 💰 Financial Breakdown & Cost-Saving Guidance for **${title}**

Here is a financial plan tailored to your budget of **₹${budgetINR.toLocaleString('en-IN')}** for **${guestCount} guests** in **${location}**:

#### 1. Per-Guest Financial Metrics
- **Overall Budget per Guest**: **₹${perGuest.toLocaleString('en-IN')}** per attendee
- **Recommended Food & Beverage Cap**: **₹${Math.round(perGuest * 0.35).toLocaleString('en-IN')}** per plate (protects funds for decor, sound, and memories)
- **Essential Contingency Reserve (5%)**: **₹${bufferPortion.toLocaleString('en-IN')}** kept aside for unexpected headcount or day-of incidentals.
${planBreakdownText}
#### 2. Recommended Realistic INR Allocation
- **Catering & Dining (32%)**: ₹${cateringPortion.toLocaleString('en-IN')}
- **Venue & Space Rental (30%)**: ₹${venuePortion.toLocaleString('en-IN')}
- **Thematic Decor & Staging (16%)**: ₹${decorPortion.toLocaleString('en-IN')}
- **Photography & Visual Teasers (10%)**: ₹${photoPortion.toLocaleString('en-IN')}
- **Entertainment, Music & Favors (7%)**: ₹${entertainmentPortion.toLocaleString('en-IN')}
- **Emergency Contingency Buffer (5%)**: ₹${bufferPortion.toLocaleString('en-IN')}

#### 3. Actionable Ways to Save 15%–25% in ${location}
1. **Curate 3 Live Counters Instead of an Overloaded Buffet**: For ${guestCount} guests, a giant buffet creates plate waste. Three signature live stations (e.g., live chaat, pasta, and tawa starters) save ₹150–₹250 per guest (saving **₹${(200 * guestCount).toLocaleString('en-IN')}** overall).
2. **Daytime or Afternoon Slots**: Booking venue slots like 3:00 PM – 7:00 PM or Sunday mornings in ${location} typically yields **20%–30% lower rental fees** compared to prime Saturday night slots.
3. **High-Impact Photo Backdrop Focal Point**: Spend 75% of your decor budget on one show-stopping photo arch with warm LED lights and matte balloons, rather than spreading thin decor across the entire hall.
4. **Bundle Media Deliverables**: Hire a solo candid photographer with a 3–4 hour package delivering high-res digital albums and a 60-second teaser reel rather than paying for two separate camera crews.
5. **Wholesale Sourcing for Return Gifts**: Buy favor hampers in bulk from local wholesale markets rather than retail gift shops to save ₹80–₹120 per gift.`;
  }

  // 2. FOOD & CATERING GUIDANCE
  if (isFood) {
    const cakeWeightKg = Math.max(1.5, Math.round((guestCount * 0.1) * 10) / 10);
    const isKidFriendly = eventType === 'birthday' || q.includes('kid') || q.includes('child');

    return `${noticeHeader}### 🍽️ Curated Food Menu & Catering Guide for **${title}**

Catering tailored for **${guestCount} guests** in **${location}** (${eventType.toUpperCase()}):

#### 1. Recommended Menu Selections
- **Welcome Refreshments & Mocktails**:
  - Chilled Fresh Mint Mojito & Spiced Kokum Fizz
  - Traditional Kesar Badam Milk or Spiced Tender Coconut Cooler
- **Appetizers & Starters (4 Selections)**:
  - Crispy Corn & Cheese Croquettes with smoky garlic dip
  - Paneer Tikka / Chicken Satay Skewers with fresh coriander-mint chutney
  - Live Chaat Counter: Sev Puri, Dahi Papdi Chaat, and Pani Puri shots
  - ${isKidFriendly ? 'Wood-Fired Mini Margherita Pizzas and French Fry baskets' : 'Stuffed Tandoori Mushrooms & Crispy Lotus Stem'}
- **Main Course Spread**:
  - Rich Paneer Butter Masala (or signature Butter Chicken)
  - Slow-simmered Dal Makhani or fragrant Tadka Dal
  - Royal Awadhi Vegetable Biryani / Jeera Pulao with pomegranate burani raita
  - Assorted Indian Breads: Butter Naan, Laccha Parotta, and Tandoori Roti
  - Live Pasta Counter: Penne in creamy Alfredo and zesty Arrabbiata sauces
- **Celebration Cake & Dessert Station**:
  - **Themed Designer Cake**: Recommended size is **${cakeWeightKg} kg** (~100g per guest) to guarantee generous slices without excessive leftovers.
  - Hot Gulab Jamun served with Pistachio Rabdi
  - Artisanal Kulfi & Ice Cream cups with roasted dry fruits

#### 2. Key Dietary & Service Protocols
- **Color-Coded Station Separation**: Clearly separate pure vegetarian, Jain, and non-vegetarian food counters with distinct bilingual signage and separate serving ladles.
- **Dedicated Jain / Vegan Provisions**: Ensure at least one starter, one curry, and bread are prepared without onion/garlic and labelled clearly for ease of mind.
- **Plate Guarantee Verification**: Indian caterers charge per plate opened. Designate an RSVP entrance coordinator or provide wristband tokens to ensure you only pay for actual attendees.`;
  }

  // 3. VENDOR SELECTION & NEGOTIATION
  if (isVendor) {
    let existingVendors = '';
    if (plan?.vendorChecklist && plan.vendorChecklist.length > 0) {
      existingVendors = `\n**Vendors on your Active Checklist:**\n` +
        plan.vendorChecklist.slice(0, 4).map(v => `- **${v.category}** (Status: ${v.status}) — *Est. Cost: ${v.estimatedCostINR}*`).join('\n') + '\n';
    }

    return `${noticeHeader}### 🤝 Vendor Selection & Negotiation Playbook for **${title}**

Practical tactics for booking and negotiating vendors in **${location}** with your **₹${budgetINR.toLocaleString('en-IN')}** budget:

#### 1. Standard Indian Event Payment Schedule
- **Booking Token (Advance)**: Pay **15% – 20%** strictly upon contract signing. Never pay more than 20% upfront.
- **Mid-Way Milestone (1–2 Weeks Prior)**: Pay **40% – 50%** after final backdrop 3D mockup approval, menu tasting, and run-of-show confirmation.
- **Completion Retention**: Retain **30% – 35%** to be cleared on event day only after satisfactory setup completion, sound testing, and live performance.
${existingVendors}
#### 2. Essential Contract Clauses to Include
- **Fixed Overtime Rate**: Specify a pre-agreed hourly fee (e.g., ₹1,500 – ₹2,500 per additional hour) so vendors cannot levy arbitrary late charges if the party extends.
- **Equipment Redundancy**: Photographers must guarantee dual-slot camera bodies and backup lenses; sound/DJ vendors must provide an inverter/UPS connection for seamless power.
- **Rescheduling / Weather Clause**: Add a clause stating your advance transfers without forfeiture if the date shifts within 6 months due to unforeseen circumstances.

#### 3. Smart Negotiation Levers in ${location}
- **Value Bundles over Cash Discounts**: Vendors are often reluctant to drop base rates, but will readily include complimentary add-ons: ask the decorator for free entryway fairy lights or a neon name sign; ask the photographer for a free 60-second Instagram reel edit.
- **The "Rule of Three"**: Always obtain at least 3 itemized quotes from vendors based in or near ${location} before finalizing to establish fair market benchmark rates.`;
  }

  // 4. TIMELINE & SCHEDULING GUIDANCE
  if (isTimeline) {
    return `${noticeHeader}### ⏱️ Actionable Timeline & Schedule for **${title}**

Optimized run-of-show for **${guestCount} guests** on **${dateStr}** (${timeStr}):

#### 1. Day-of-Event Master Run-Sheet (Evening Schedule)
- **T - 3:00 Hours (3:30 PM)**: Venue doors open. Decorator initiates backdrop setup, balloon arch construction, and ambient lighting check.
- **T - 2:00 Hours (4:30 PM)**: Sound & DJ team arrives. Speaker sound checks, wireless microphone frequency test, and background playlist initialization.
- **T - 1:30 Hours (5:00 PM)**: Cake delivery arrival; verify design integrity and temperature storage. Hosts arrive for dressing touch-ups and initial portraits.
- **T - 0:30 Hours (6:00 PM)**: Welcome drinks counter & live appetizers open. Ambient background music begins as early guests arrive.
- **T + 0:00 (6:30 PM - 7:15 PM)**: Main guest arrivals, welcome greetings, and candid photo-corner moments.
- **T + 0:45 (7:15 PM - 8:00 PM)**: Opening welcome address by host or emcee, interactive group activities, or celebratory highlights (cake cutting / ceremony).
- **T + 1:30 (8:00 PM - 9:30 PM)**: Main dinner buffet opens. Music transitions to upbeat celebratory favorites; mingling and photography continue.
- **T + 3:00 (9:30 PM - 10:00 PM)**: Distribution of return gift hampers, host vote of thanks, and final vendor wrap-up.

#### 2. Key Countdown Milestones
- **4 Weeks Out**: Finalize guest list and dispatch digital WhatsApp invitations with RSVP link.
- **2 Weeks Out**: Reconfirm dietary counts with caterer, finalize cake design, and compile must-play songs.
- **48 Hours Out**: Call all booked vendors to confirm exact arrival timestamps and venue loading bay access.`;
  }

  // 5. DECOR & THEME SUGGESTIONS
  if (isDecor) {
    return `${noticeHeader}### 🎨 Decor & Thematic Concept for **${title}**

Visual styling recommendations designed for **${location}**:

#### 1. Core Visual Anchors
- **Grand Entrance Archway**: Welcoming balloon arch or seasonal floral torans paired with warm fairy lights and personalized welcome signage (*"Welcome to ${title}"*).
- **Focal Stage & Cake Backdrop**: Multi-layered backdrop with warm 3000K LED uplighting, custom neon name lettering, and organic pastel balloon or floral cascades.
- **Interactive Photobooth Corner**: Dedicated photo area with thematic props, polaroid guestbook station, and ring light setup.

#### 2. Atmosphere & Lighting Design
- Utilize warm ambient lighting (amber/golden) rather than stark cool white fluorescent lights.
- Accentuate food counters and cake tables with battery-operated tea lights and floral urlis for a festive touch.`;
  }

  // 6. INVITATION & SPEECH WORDING
  if (isInviteOrSpeech) {
    return `${noticeHeader}### ✉️ Invitation Copy & Host Speech for **${title}**

#### 1. Ready-to-Send WhatsApp Invitation Template
\`\`\`text
✨ You are cordially invited! ✨

Please join us to celebrate:
🎉 *${title}*

📅 Date: ${dateStr}
⏰ Time: ${timeStr}
📍 Location / Venue: ${location}

Your presence, blessings, and company will make this celebration truly special!

Kindly RSVP with your attending guest count so we can finalize catering arrangements.
We look forward to welcoming you!
\`\`\`

#### 2. Warm 2-Minute Host Speech
> *"Good evening everyone and a warm welcome! Thank you so much for taking the time to join us today for ${title}. Having our cherished family and friends together in ${location} means the world to us. Please enjoy the evening, relish the food and music, and let's create golden memories together tonight. Thank you!"*`;
  }

  // 7. GENERAL / MULTI-PURPOSE ADVISORY
  return `${noticeHeader}### 💡 EventEase Planning Advisory for **${title}**

Tailored recommendations for your celebration in **${location}** (Budget: **₹${budgetINR.toLocaleString('en-IN')}**, Guests: **${guestCount}**):

- **Event Focus**: You are planning a **${eventType}** celebration. Ensure core guest experiences (tasty hot food, seamless timeline, and comfortable seating) are prioritized.
- **Per-Guest Allocation**: Your overall budget works out to **₹${Math.round(budgetINR / guestCount).toLocaleString('en-IN')} per attendee**, giving you ample room for a wonderful celebration with disciplined vendor selection.
- **Coordination Tip**: Appoint a trusted friend or family member as the designated point-of-contact for vendor arrivals on the event day so you can enjoy every moment stress-free.

Feel free to ask specific questions about your budget breakdown, menu selections, vendor contract clauses, or day-of run-sheets!`;
}


// Dynamic fallback generator when AI API key is pending or offline
function generateHeuristicPlan(input: EventInput): EventPlan {
  const budget = Number(input.budgetINR) || 1000000;
  const isWedding = input.eventType === 'wedding';
  const isBirthday = input.eventType === 'birthday';

  let breakdown: any[] = [];
  if (isWedding) {
    breakdown = [
      { id: 'b-1', category: 'Venue & Lawns', allocatedINR: Math.round(budget * 0.32), percentage: 32, priority: 'Must-Have', description: `Prime venue in ${input.location} for ${input.guestCount} guests with bridal suite.`, moneySavingTip: 'Consider Friday or Sunday evening bookings for lower rental fees.' },
      { id: 'b-2', category: 'Catering & Dining', allocatedINR: Math.round(budget * 0.28), percentage: 28, priority: 'Must-Have', description: `Multi-course spread with live counters tailored for ${input.guestCount} guests.`, moneySavingTip: 'Limit live counters to 3 signature favorites to avoid buffet surplus.' },
      { id: 'b-3', category: 'Decor & Floral Staging', allocatedINR: Math.round(budget * 0.15), percentage: 15, priority: 'Must-Have', description: 'Mandap, stage backdrop, floral entrance, and fairy-light ambient mood.', moneySavingTip: 'Utilize seasonal marigolds, tuberoses, and brass urlis for maximum visual impact.' },
      { id: 'b-4', category: 'Photography & Cinematography', allocatedINR: Math.round(budget * 0.10), percentage: 10, priority: 'Must-Have', description: 'Candid photographer, traditional coverage, teaser reel, and album.', moneySavingTip: 'Combine pre-wedding shoot with wedding day deliverables for package rates.' },
      { id: 'b-5', category: 'DJ, Sound & Lights', allocatedINR: Math.round(budget * 0.06), percentage: 6, priority: 'Recommended', description: 'JBL sound system, wireless mics, moving head lights, and party playlist.', moneySavingTip: 'Source sound and lighting from an authorized in-house venue vendor to waive royalty fees.' },
      { id: 'b-6', category: 'Attire & Makeup', allocatedINR: Math.round(budget * 0.04), percentage: 4, priority: 'Recommended', description: 'Bridal & groom styling, HD makeup, and family touch-ups.', moneySavingTip: 'Book trial sessions in advance to lock current season pricing.' },
      { id: 'b-7', category: 'Invitations & Favors', allocatedINR: Math.round(budget * 0.03), percentage: 3, priority: 'Recommended', description: 'Digital animated invitations, printed cards for elders, return hampers.', moneySavingTip: 'Use digital WhatsApp animated video invites to save 80% on postage and printing.' },
      { id: 'b-8', category: 'Emergency Contingency', allocatedINR: Math.round(budget * 0.02), percentage: 2, priority: 'Must-Have', description: 'Buffer for last-minute plate additions, transport, tips, and incidentals.', moneySavingTip: 'Strictly monitor guest count verification at the entrance.' },
    ];
  } else if (isBirthday) {
    breakdown = [
      { id: 'b-1', category: 'Venue & Play Zone', allocatedINR: Math.round(budget * 0.30), percentage: 30, priority: 'Must-Have', description: `Party hall or indoor play lounge in ${input.location} accommodating ${input.guestCount} guests.`, moneySavingTip: 'Afternoon slots (3 PM - 7 PM) typically offer 25% lower hall rental rates.' },
      { id: 'b-2', category: 'Food & Gourmet High Tea', allocatedINR: Math.round(budget * 0.30), percentage: 30, priority: 'Must-Have', description: 'Appetizers, live pasta/chaat counter, dinner buffet, and refreshments.', moneySavingTip: 'A curated high-tea menu with hearty appetizers saves substantially over formal sit-down courses.' },
      { id: 'b-3', category: 'Thematic Backdrop & Balloon Decor', allocatedINR: Math.round(budget * 0.15), percentage: 15, priority: 'Must-Have', description: 'Custom thematic photo arch, balloon garland, neon name sign, and cake table.', moneySavingTip: 'Opt for biodegradable matte latex balloons rather than single-use foil structures.' },
      { id: 'b-4', category: 'Designer Cake & Sweet Table', allocatedINR: Math.round(budget * 0.08), percentage: 8, priority: 'Recommended', description: 'Multi-tier customized themed cake with matching cupcakes and pops.', moneySavingTip: 'Keep top tier custom decorated and supplement with sheet cake for guest distribution.' },
      { id: 'b-5', category: 'Host, Magician & Entertainment', allocatedINR: Math.round(budget * 0.08), percentage: 8, priority: 'Must-Have', description: 'Engaging emcee, comedy magic act, tattoo artist, and interactive games.', moneySavingTip: 'Bundle magician and emcee together from the same entertainer.' },
      { id: 'b-6', category: 'Candid Photography', allocatedINR: Math.round(budget * 0.06), percentage: 6, priority: 'Recommended', description: 'High-res photos of cake-cutting, family moments, and instant digital delivery.', moneySavingTip: 'Hire a solo candid specialist for 3 hours instead of a full day crew.' },
      { id: 'b-7', category: 'Return Gifts & Favors', allocatedINR: Math.round(budget * 0.03), percentage: 3, priority: 'Recommended', description: `Curated age-appropriate favor hampers for ${input.guestCount} attendees.`, moneySavingTip: 'Source gifts from wholesale distributors in bulk.' },
    ];
  } else {
    breakdown = [
      { id: 'b-1', category: 'Staging, Sound & LED Wall', allocatedINR: Math.round(budget * 0.30), percentage: 30, priority: 'Must-Have', description: `Covered stage, sound reinforcement, and digital display in ${input.location}.`, moneySavingTip: 'Partner with local commercial tech sponsors for equipment barter.' },
      { id: 'b-2', category: 'Canopy Tents & Stalls', allocatedINR: Math.round(budget * 0.20), percentage: 20, priority: 'Must-Have', description: `Pagoda canopies, lighting, tables and power supplies for stalls.`, moneySavingTip: 'Nominal stall vendor fees offset overall infrastructure expenses.' },
      { id: 'b-3', category: 'Festive Lighting & Decor', allocatedINR: Math.round(budget * 0.15), percentage: 15, priority: 'Must-Have', description: 'Fairy lights, welcome gateway, banner signage, and ambient illumination.', moneySavingTip: 'Use reusable fabric bunting and LED solar lights.' },
      { id: 'b-4', category: 'Food & Refreshment Counters', allocatedINR: Math.round(budget * 0.20), percentage: 20, priority: 'Must-Have', description: `Buffet refreshments and welcome chai/snacks for ${input.guestCount} participants.`, moneySavingTip: 'Invite certified local food trucks on revenue-sharing terms.' },
      { id: 'b-5', category: 'Contests & Awards', allocatedINR: Math.round(budget * 0.06), percentage: 6, priority: 'Recommended', description: 'Trophies, certificates, and eco-friendly hampers for participants.', moneySavingTip: 'Get local businesses to sponsor gift vouchers in exchange for flyer distribution.' },
      { id: 'b-6', category: 'Safety & Sanitation', allocatedINR: Math.round(budget * 0.06), percentage: 6, priority: 'Must-Have', description: 'Security guards, waste segregation bins, and post-event sweepers.', moneySavingTip: 'Involve youth volunteers to lead crowd management.' },
      { id: 'b-7', category: 'Permissions & Buffer', allocatedINR: Math.round(budget * 0.03), percentage: 3, priority: 'Must-Have', description: 'Permit fees, noise clearances, generator diesel and contingency reserve.', moneySavingTip: 'File clearance permits at least 30 days in advance.' },
    ];
  }

  return {
    id: 'plan-' + Date.now(),
    createdAt: new Date().toISOString(),
    input: input,
    executiveSummary: `An impeccably organized ${input.eventType} celebration in ${input.location} designed for ${input.guestCount} guests, optimizing every rupee of the ₹${budget.toLocaleString('en-IN')} budget.`,
    budgetBreakdown: breakdown,
    timeline: [
      { id: 't-1', phase: '6-12 Months Before', title: 'Confirm Date & Venue', description: `Lock in the property in ${input.location} and pay booking token.`, deadlineOffset: '6-9 months prior', category: 'Venue', isCompleted: false, priority: 'high' },
      { id: 't-2', phase: '3-6 Months Before', title: 'Select Core Vendors', description: 'Interview and lock caterer, decorator, and photographer.', deadlineOffset: '4-5 months prior', category: 'Vendors', isCompleted: false, priority: 'high' },
      { id: 't-3', phase: '1-2 Months Before', title: 'Send Invitations & Confirm Menus', description: 'Dispatch WhatsApp and digital invites with RSVP links.', deadlineOffset: '6 weeks prior', category: 'Guest Relations', isCompleted: false, priority: 'high' },
      { id: 't-4', phase: '2-3 Weeks Before', title: 'Finalize Schedule & Logistics', description: 'Run of show timeline, audio check timing, and guest transport.', deadlineOffset: '2 weeks prior', category: 'Logistics', isCompleted: false, priority: 'medium' },
      { id: 't-5', phase: 'Week of Event', title: 'Vendor Walkthrough & Final Headcount', description: 'Inspect venue layout, test power backup, and reconfirm dietary headcounts.', deadlineOffset: '3 days prior', category: 'Production', isCompleted: false, priority: 'high' },
      { id: 't-6', phase: 'Event Day', title: 'Execution & Master Coordination', description: 'Manage arrivals, ceremonies, dining service, and wrap-up.', deadlineOffset: 'Day of Event', category: 'Execution', isCompleted: false, priority: 'high' },
      { id: 't-7', phase: 'Post-Event', title: 'Vendor Settlements & Photo Collection', description: 'Clear vendor dues and collect guest photos and candid videos.', deadlineOffset: '3 days after', category: 'Wrap-up', isCompleted: false, priority: 'medium' },
    ],
    vendorChecklist: [
      {
        id: 'v-1',
        category: isWedding ? 'Catering & Banquet Service' : isBirthday ? 'Party Catering & Finger Foods' : 'Food & Refreshment Stalls',
        estimatedCostINR: `₹${Math.round(budget * 0.25).toLocaleString('en-IN')} - ₹${Math.round(budget * 0.32).toLocaleString('en-IN')}`,
        importance: 'Critical',
        questionsToAsk: [
          'What is the staff-to-guest ratio for live food stations?',
          'What is the grace margin if guest attendance exceeds by 10%?',
          'Is water, ice, and disposal service fully inclusive?'
        ],
        deliverablesChecklist: [
          'Pre-event food tasting session for 4 persons',
          'Eco-friendly cutlery and clean presentation table linens',
          'Dedicated food station supervisor'
        ],
        status: 'To Contact'
      },
      {
        id: 'v-2',
        category: 'Thematic Decor & Lighting Specialist',
        estimatedCostINR: `₹${Math.round(budget * 0.12).toLocaleString('en-IN')} - ₹${Math.round(budget * 0.18).toLocaleString('en-IN')}`,
        importance: 'Critical',
        questionsToAsk: [
          'Can you show live photos from past setups in this specific venue?',
          'What is your contingency arrangement if it gets windy or rains?',
          'At what time will setup be 100% completed for photo inspection?'
        ],
        deliverablesChecklist: [
          'Grand entrance archway with custom signage',
          'Centerpiece backdrop with warm LED spotlighting',
          'Selfie / photobooth area with thematic props'
        ],
        status: 'To Contact'
      },
      {
        id: 'v-3',
        category: 'Photography & Highlight Reel Film',
        estimatedCostINR: `₹${Math.round(budget * 0.08).toLocaleString('en-IN')} - ₹${Math.round(budget * 0.12).toLocaleString('en-IN')}`,
        importance: 'Important',
        questionsToAsk: [
          'How quickly will you deliver the 60-second highlight teaser?',
          'Will we receive all raw high-resolution files without watermarks?',
          'Do you have backup cameras and memory cards on site?'
        ],
        deliverablesChecklist: [
          'Full-event candid and portrait coverage',
          'Color-graded digital gallery within 14 days',
          'Short video teaser for social media'
        ],
        status: 'To Contact'
      }
    ],
    creativeIdeas: {
      themes: [
        {
          name: isWedding ? 'Royal Celestial Twilight' : (isBirthday ? 'Enchanted Pastel Dreamland' : 'Heritage Festival of Unity'),
          tagline: isWedding ? 'Timeless Elegance Under Golden Candlelight' : (isBirthday ? 'Playful Sparkles & Joyous Smiles' : 'Community Spirit & Cultural Joy'),
          description: `A sophisticated aesthetic blending rich royal indigo, shimmering gold, and serene ivory, tailored for ${input.location}.`,
          colorPalette: [
            { name: 'Royal Indigo', hex: '#1E295B' },
            { name: 'Radiant Gold', hex: '#D4AF37' },
            { name: 'Soft Ivory', hex: '#FAF9F6' },
            { name: 'Rose Blush', hex: '#E29578' }
          ],
          vibeTags: ['Celebratory', 'Warm', 'Elegant', 'Photogenic'],
          dressCode: isWedding ? 'Regal Ethnic & Indo-Western Tuxedos' : 'Festive Pastels or Smart Casuals'
        },
        {
          name: 'Modern Minimalist Chic',
          tagline: 'Clean Lines, Contemporary Florals & Warm Glow',
          description: 'Contemporary foliage, warm Edison bulbs, neutral linen textures, and geometric accents.',
          colorPalette: [
            { name: 'Eucalyptus Green', hex: '#5F7A61' },
            { name: 'Champagne Beige', hex: '#E6D5B8' },
            { name: 'Warm White', hex: '#FFFFFF' },
            { name: 'Charcoal Slate', hex: '#333333' }
          ],
          vibeTags: ['Modern', 'Airy', 'Sophisticated', 'Zero-Clutter'],
          dressCode: 'Crisp linens, cocktail dresses, and contemporary ethnic wear.'
        }
      ],
      decorSuggestions: [
        {
          area: 'Welcome Entrance & Gateway',
          idea: 'Luminescent Archway with Scented Florals',
          elements: ['Brass urlis with floating rose petals and tea-lights', 'Customized monogram welcome signage', 'Warm fairy-light canopy']
        },
        {
          area: 'Main Focal Stage & Backdrop',
          idea: 'Multi-Dimensional Layered Backdrop',
          elements: ['Warm architectural uplighting with soft diffusers', 'Floral cascade with fresh seasonal flowers', 'Illuminated event name neon lettering']
        },
        {
          area: 'Interactive Photobooth & Memory Corner',
          idea: 'Picture-Perfect Frame with Instant Print Corner',
          elements: ['Thematic vintage or floral frame', 'Fun hand-held props with witty captions', 'Instant polaroid guestbook with metallic markers']
        }
      ],
      foodAndBeverage: {
        welcomeDrinks: [
          'Chilled Kesar Pista Shikanji with mint sprigs',
          'Tropical Passionfruit & Mango Cooler',
          'Classic Spiced Kokum Fizz'
        ],
        appetizers: [
          'Tandoori Paneer Tikka with mint-coriander reduction',
          'Crispy Corn Croquettes with spicy chipotle dip',
          'Live Chaat Station: Sev Puri, Golgappa flight, and Palak Patta Chaat',
          'Wood-Fired Mini Pizzas on focaccia crust'
        ],
        mainCourseHighlights: [
          'Rich Paneer Butter Masala with butter naan',
          'Dal Bukhara simmered overnight with rustic spices',
          'Fragrant Awadhi Veg Biryani with burani garlic raita',
          'Live Pasta Counter with arrabbiata and truffle Alfredo sauces'
        ],
        dessertStations: [
          'Hot Jalebi with Pistachio Rabdi',
          'Baked Saffron Cheesecake tartlets',
          'Artisanal Kulfi bar with falooda and roasted dry fruits'
        ],
        cateringTips: [
          'Ensure separate designated vegetarian and Jain service counters with clean signage.',
          'Schedule a mid-event beverage refill wave to keep guests hydrated.'
        ]
      },
      invitations: {
        digitalCardCopy: `Together with their families, invite you to join the celebration of ${input.title}. Your warm presence will make the memories truly golden.`,
        whatsappMessageTemplate: `✨ You are cordially invited to celebrate ${input.title} on ${input.date || 'the upcoming date'} in ${input.location}. Please click here to view the itinerary and RSVP: https://eventease.ai/event-rsvp`,
        formalInvitationText: `We request the honor of your company as we celebrate ${input.title}. Let us make unforgettable memories together.`,
        designAestheticPrompt: 'Deep royal blue parchment with gold geometric mandala borders and modern serif typography.',
        rsvpDeadlineRecommendation: 'Request RSVPs 3 weeks prior to lock final seating and meal guarantees.'
      }
    },
    smartRecommendations: [
      `Lock in your venue and key vendors in ${input.location} early to avoid last-minute price surge.`,
      `With a budget of ₹${budget.toLocaleString('en-IN')}, dedicating 2-3% as an emergency buffer prevents payment stress on the big day.`,
      `Designate one family member or friend as the official vendor contact on event day so you can enjoy every minute stress-free.`
    ]
  };
}

// Dev server vs Production setup
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventEase AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
