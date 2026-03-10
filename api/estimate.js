module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.' });
  }

  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: 'Task description is required.' });
  }

  const systemPrompt = `You are a time and cost compression analyst. Given a task description, you estimate how long it would take AND how much it would cost under three execution scenarios. Be realistic and accurate.

SCENARIOS:

1. SOLO HUMAN — One world-class professional doing everything manually. No AI tools. Expert-level skill, traditional tools only. Include time for research, breaks, context-switching, and quality checks.

2. HUMAN TEAM — 3-5 world-class professionals working together with good coordination. Traditional tools, no AI. Factor in: parallel work benefits, coordination overhead, meetings, reviews, handoffs.

3. AI AGENT — A modern AI operating system: Claude Code with agent teams (multiple AI agents working in parallel), full bash/terminal access, API integrations, automated pipelines, custom scripts, web scraping, file system access, and code execution. This is NOT ChatGPT — it's a fully autonomous AI OS that can write and execute code, call APIs, process thousands of files, build and deploy apps, and coordinate multiple agents simultaneously.

COST ESTIMATION APPROACH:

For SOLO and TEAM costs, determine:
- What type of professional(s) would ACTUALLY be needed — match the real job title to the task
- Use REALISTIC US market hourly rates. Do NOT inflate. Use these tiers:
  * Administrative / clerical (data entry, form filling, scheduling, filing, organizing): $15-25/hr
  * Virtual assistant (research, email management, basic coordination): $15-30/hr
  * Skilled freelancer (video editing, graphic design, copywriting, social media): $25-50/hr
  * Professional (software development, instructional design, marketing strategy): $40-75/hr
  * Senior specialist (system architect, lead developer, consultant): $75-150/hr
  * Executive / C-suite consulting: $150-300/hr
- CRITICAL: Match the task to the LOWEST appropriate tier. Filling out an HOA application is $18/hr admin work, NOT $80/hr professional work. Writing emails is $30/hr copywriting, NOT $90/hr. Editing video clips is $30/hr, NOT $60/hr. Be honest about what the work actually is.
- Total cost = hourly rate(s) x hours worked
- For TEAM: sum the individual costs of all team members for their hours

For AI AGENT cost, estimate based on ACTUAL API pricing and what the task requires:

Token costs (LLM calls):
- Claude Sonnet: ~$3/M input tokens, ~$15/M output tokens
- A typical short prompt + response (~2K tokens total) costs about $0.01-0.03
- A complex multi-step task with 50 LLM calls might use 500K tokens total = ~$2-5
- Simple text parsing, data extraction, form filling = pennies ($0.01-0.10)
- Medium complexity (writing content, code generation, research) = $0.50-5
- High complexity (multi-agent workflows, massive codebases, hundreds of API calls) = $5-50

Other costs to factor in ONLY if the task requires them:
- Image generation (DALL-E/Midjourney): $0.02-0.12 per image
- Speech-to-text (Whisper): ~$0.006/min of audio
- Web scraping / API calls: usually free or pennies
- Cloud compute (if needed): $0.01-0.10/hr for basic tasks
- Vector embeddings: ~$0.0001/1K tokens (basically free)

CRITICAL: Most simple tasks (parsing emails, filling forms, organizing data, writing a few emails) cost LESS THAN $0.50 in API costs. Do NOT round up to $8 for something that costs $0.05. Be precise. Use decimals if the cost is under $1 (e.g., $0.15, $0.03). Only use whole dollars for genuinely expensive multi-step tasks.

Cost scale examples:
- Fill out a form from provided data: $0.02-0.05
- Parse and organize 50 emails: $0.10-0.30
- Write 5 marketing emails: $0.30-0.75
- Build a landing page from scratch: $1-3
- Full app build + deployment: $5-25
- Multi-day multi-agent project (curriculum, community, funnel): $15-50

RULES:
- Be honest. If AI can't do something physical, say so.
- For digital/knowledge work, AI is typically 10-200x faster and dramatically cheaper.
- Express hours as numbers (0.5 for 30 min, 0.75 for 45 min).
- Express costs as numbers. Use decimals for amounts under $1 (e.g., 0.05, 0.30). Use whole dollars for $1+. Include the rate breakdown in reasoning.
- Keep reasoning to 2-3 concise sentences each. Include the rate(s) used.
- The tagline should be punchy and quotable.
- DO NOT inflate rates to make savings look bigger. The real numbers are already impressive enough. Credibility matters more than shock value.

Return ONLY valid JSON in this exact format — no markdown, no code fences, just the raw JSON object:
{
  "estimates": {
    "solo": { "time": "human readable", "hours": 480, "cost": 48000, "rate": "$100/hr (senior developer)", "reasoning": "2-3 sentences including rate justification" },
    "team": { "time": "human readable", "hours": 120, "cost": 18000, "rate": "4 people avg $150/hr", "reasoning": "2-3 sentences including team composition and rates" },
    "ai": { "time": "human readable", "hours": 5, "cost": 3.50, "rate": "~$0.70/hr in API costs", "reasoning": "2-3 sentences including token/compute cost breakdown" }
  },
  "compression_ratio": 96,
  "cost_savings": 47985,
  "tagline": "One punchy sentence comparing solo vs AI"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Estimate time and cost for this task:\n\n${task.trim()}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', response.status, errorData);
      return res.status(502).json({
        error: `AI estimation failed (${response.status}). ${errorData.error?.message || 'Try again.'}`
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON from response
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    // Validate structure
    if (!parsed.estimates?.solo || !parsed.estimates?.team || !parsed.estimates?.ai) {
      throw new Error('Invalid response structure');
    }

    // Calculate compression ratio if not provided
    if (!parsed.compression_ratio && parsed.estimates.solo.hours && parsed.estimates.ai.hours) {
      parsed.compression_ratio = Math.round(parsed.estimates.solo.hours / parsed.estimates.ai.hours);
    }

    // Calculate cost savings if not provided
    if (!parsed.cost_savings && parsed.estimates.solo.cost && parsed.estimates.ai.cost) {
      parsed.cost_savings = parsed.estimates.solo.cost - parsed.estimates.ai.cost;
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Estimation error:', err);
    return res.status(500).json({
      error: err.message || 'Something went wrong with the estimation.'
    });
  }
}
