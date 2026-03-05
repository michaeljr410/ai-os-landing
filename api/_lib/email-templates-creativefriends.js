/**
 * AIOS Blueprint — Creative Friends Email Templates
 * Squad Up Summit-specific funnel for Mike's inner circle.
 * 4 emails: confirmation, pre-summit prep, networking power move, check-in/testimonial
 *
 * These replace the default drip for anyone who purchases via /creativefriends page.
 */

const SITE_URL = 'https://aiosblueprint.com';
const CALENDLY_URL = 'https://calendly.com/topwheelsmike/aios-blueprint-consultation';
const ACCENT = '#00e5ff';
const GOLD = '#eeb544';
const DARK = '#0a0e17';

// ── Layout wrapper ──
function layout(bodyContent, preheaderText) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>AI OS Blueprint</title>
<!--[if mso]><style>body,table,td{font-family:Arial,Helvetica,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%">
${preheaderText ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all">${preheaderText}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5">
<tr><td align="center" style="padding:32px 16px">

<!-- Container -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">

<!-- Header -->
<tr><td style="background:${DARK};padding:24px 40px;text-align:center">
<span style="font-family:'Courier New',Courier,monospace;font-size:12px;color:${GOLD};letter-spacing:3px;text-transform:uppercase;font-weight:700">AI OS <span style="color:#6b7280">BLUEPRINT</span></span>
<br><span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#6b7280;letter-spacing:2px;text-transform:uppercase">CREATIVE CIRCLE</span>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px 28px;font-size:15px;line-height:1.65;color:#1f2937">
${bodyContent}
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="vertical-align:top;padding-right:14px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:44px;height:44px;border-radius:22px;background:${DARK};text-align:center;font-size:17px;color:${GOLD};font-weight:700;font-family:'Courier New',monospace;line-height:44px">M</td></tr></table>
</td>
<td style="vertical-align:middle">
<p style="margin:0;font-size:14px;font-weight:600;color:#1f2937">Mike Davis</p>
<p style="margin:2px 0 0;font-size:12px;color:#6b7280">Creator of the AIOS Blueprint&trade;</p>
</td>
</tr></table>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
<p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6">&copy; 2026 Vivant Investments LLC &middot; <a href="${SITE_URL}" style="color:#6b7280;text-decoration:underline">aiosblueprint.com</a></p>
</td></tr>

</table>
<!-- /Container -->

</td></tr>
</table>
</body>
</html>`;
}

// ── CTA button ──
function btn(text, url, bgColor) {
  bgColor = bgColor || GOLD;
  const textColor = bgColor === GOLD ? DARK : DARK;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0"><tr>
<td align="center" style="background:${bgColor};border-radius:6px">
<a href="${url}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:${textColor};text-decoration:none;letter-spacing:.3px">${text}</a>
</td></tr></table>`;
}

// ── Step row (numbered) ──
function stepRow(num, title, desc) {
  return `<tr>
<td style="width:36px;vertical-align:top;padding:10px 0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:28px;height:28px;border-radius:14px;background:${DARK};color:${GOLD};font-family:'Courier New',monospace;font-size:12px;font-weight:700;text-align:center;line-height:28px">${num}</td></tr></table>
</td>
<td style="vertical-align:top;padding:10px 0 10px 12px">
<p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1f2937">${title}</p>
<p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5">${desc}</p>
</td></tr>`;
}

// ── Callout box ──
function callout(emoji, title, body, borderColor) {
  borderColor = borderColor || GOLD;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid ${borderColor};padding:14px 20px;background:#f8fafc;margin:0">
<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${DARK}">${emoji} ${title}</p>
<p style="margin:0;font-size:13px;color:#6b7280;line-height:1.55">${body}</p>
</td></tr></table>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CF-E1: Purchase Confirmation (Immediate)
//  "Welcome to the circle"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function purchaseConfirmation({ firstName, tier, sessionId }) {
  const downloadUrl = `${SITE_URL}/thank-you?tier=${tier}&session_id=${sessionId}`;
  const tierName = tier === '2' ? 'Full System (Tier 2)' : 'Blueprint (Tier 1)';

  const calendlyBlock = tier === '2' ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:20px 24px;margin:0">
<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#92400e">&#127919; Your 1-on-1 Consultation Is Included</p>
<p style="margin:0 0 12px;font-size:13px;color:#78350f;line-height:1.5">You got the Full System &mdash; that includes a <strong>1-hour private setup session</strong> with me on Zoom. I'm going to make sure this is dialed in for YOUR specific business. Book it now.</p>
${btn('Book Your Consultation &rarr;', CALENDLY_URL)}
</td></tr></table>` : '';

  const content = `
<p style="margin:0 0 20px;font-size:22px;font-weight:700;color:${DARK};letter-spacing:-.3px">We all we got${firstName ? `, ${firstName}` : ''}.</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">You're in. And you're about to walk into every room, every event, every deal with an unfair advantage &mdash; your own AI operating system that knows your business, your voice, and your goals.</p>

<p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:500">Your purchase</p>
<p style="margin:0 0 20px;font-size:16px;font-weight:600;color:${DARK}">AIOS Blueprint&trade; &mdash; ${tierName}</p>

${btn('Download Your AI OS &rarr;', downloadUrl)}

${calendlyBlock}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;margin-top:28px;padding-top:24px">
<tr><td colspan="2"><p style="margin:0 0 16px;font-size:15px;font-weight:600;color:${DARK}">Get It Running &mdash; 3 Steps</p></td></tr>
${stepRow('1', 'Download Claude Desktop', 'Free app from <a href="https://claude.ai" style="color:' + ACCENT + ';text-decoration:underline">claude.ai</a> &mdash; Mac or Windows.')}
${stepRow('2', 'Subscribe to Claude Pro ($20/mo)', 'This is the engine. It powers the entire system.')}
${stepRow('3', 'Paste the Magic Install Prompt', 'Open the Code tab in Claude Desktop. Paste the prompt from your download. Everything installs itself.')}
</table>

<p style="margin:24px 0 0;font-size:14px;color:#6b7280;line-height:1.55">Get this installed ASAP. Over the next few days I'm going to send you some specific ways to use this &mdash; especially heading into Squad Up.</p>

<p style="margin:12px 0 0;font-size:14px;color:#6b7280">Hit reply if you need anything. I'll see it.</p>`;

  return {
    subject: `You're in${firstName ? `, ${firstName}` : ''} — your AI OS is ready`,
    html: layout(content, 'Your AI operating system is ready to download. Get it installed before Squad Up.'),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CF-E2: Day 2 — Pre-Summit Prep
//  "Get dialed in before Squad Up"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function preSummitPrep({ firstName, tier, sessionId }) {
  const downloadUrl = `${SITE_URL}/thank-you?tier=${tier}&session_id=${sessionId}`;

  const content = `
<p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK}">Quick prep before Squad Up${firstName ? `, ${firstName}` : ''}</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">Squad Up is around the corner. Here's how to walk in with your AI system already working for you &mdash; not scrambling to set it up after.</p>

<p style="margin:0 0 4px;font-size:14px;font-weight:600;color:${DARK}">If you haven't installed it yet:</p>
<p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.55">Open Claude Desktop, paste the install prompt, and let it run. Takes 30 minutes. <a href="${downloadUrl}" style="color:${ACCENT};text-decoration:underline">Re-download your files here.</a></p>

<p style="margin:0 0 16px;font-size:15px;font-weight:600;color:${DARK}">3 things to do RIGHT NOW before you walk in:</p>

${callout('&#128171;', 'Brain dump your business', 'Tell your AI everything. <em>"Here\'s my business: [what you do]. My clients are [who]. My goal this quarter is [what]."</em> The more context you give it, the more powerful it gets. Don\'t hold back &mdash; give it your whole operation.', GOLD)}
<div style="height:12px"></div>

${callout('&#128203;', 'Load your active pipeline', 'Tell it about every deal, every lead, every project you\'re working on right now. Names, stages, next steps. Your AI becomes your pipeline tracker &mdash; it\'ll flag what\'s slipping and tell you who to follow up with.', GOLD)}
<div style="height:12px"></div>

${callout('&#127919;', 'Set your Squad Up goals', 'Tell your AI: <em>"I\'m going to Squad Up Summit. Here\'s what I want to accomplish there: [your goals]. Help me prepare."</em> It\'ll draft talking points, research attendees if you give it names, and help you map out who to connect with.', GOLD)}

<p style="margin:24px 0 0;font-size:15px;color:#374151;line-height:1.65;font-weight:500">Do these three things and you'll already be ahead of 99% of people walking into that event.</p>

<p style="margin:16px 0 0;font-size:14px;color:#6b7280">Next email: a networking power move you can use at Squad Up. Stay tuned.</p>`;

  return {
    subject: 'Do this before Squad Up — 3 quick prep steps',
    html: layout(content, 'Three things to set up in your AI OS before Squad Up Summit.'),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CF-E3: Day 4 — Networking Power Move
//  "The follow-up machine"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function networkingPowerMove({ firstName }) {
  const content = `
<p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK}">The networking power move${firstName ? `, ${firstName}` : ''}</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">Here's a use case that'll hit different at Squad Up &mdash; or honestly any networking event, meetup, or conference you go to.</p>

<p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${DARK}">The problem:</p>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">You talk to 20 people at an event. You exchange numbers or business cards. You <em>mean</em> to follow up. And then life happens. Three days later you're looking at a stack of cards going "who was this person again?" Sound familiar?</p>

<p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${DARK}">The AI OS play:</p>
<p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.65">After every meaningful conversation at the event, pull out your phone and tell your AI:</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${DARK};border-radius:6px;padding:20px 24px">
<p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:13px;color:${ACCENT};line-height:1.6"><em>"Just met [Name] from [Company]. They do [what]. We talked about [topic]. They're interested in [thing]. Their number is [xxx]. Draft a follow-up text I can send tomorrow morning."</em></p>
</td></tr></table>

<p style="margin:20px 0;font-size:15px;color:#374151;line-height:1.65">Your AI captures everything &mdash; who they are, what you discussed, the opportunity. Then it drafts a personalized follow-up that sounds like you, references something specific from the conversation, and includes whatever link or offer makes sense.</p>

<p style="margin:0 0 4px;font-size:15px;font-weight:600;color:${DARK}">Level it up:</p>

${callout('&#128241;', 'Pair it with an AI note taker', 'If you use Otter, Fireflies, or any AI companion that listens to conversations &mdash; feed the transcripts into your AI OS. It\'ll pull names, key details, and action items automatically. Your AI becomes your networking memory.', ACCENT)}
<div style="height:12px"></div>

${callout('&#128279;', 'Auto-send your booking link', 'Tell your AI: <em>"For every new contact I add, draft a follow-up that includes my Calendly link."</em> Now every person you meet gets a clean, personalized follow-up with a path to continue the conversation &mdash; automatically.', ACCENT)}
<div style="height:12px"></div>

${callout('&#128200;', 'Build a people database', 'Tell your AI to save every new contact to your brain &mdash; name, company, what you discussed, follow-up status. Over time, you build a CRM that actually has context. Before your next event, ask it: <em>"Who should I reconnect with from Squad Up?"</em>', ACCENT)}

<p style="margin:24px 0 0;font-size:15px;color:#374151;line-height:1.65">Most people walk out of events with a pocket full of contacts and no system. You walk out with an AI that remembers every conversation, drafts every follow-up, and tracks every relationship.</p>

<p style="margin:16px 0 0;font-size:15px;color:#374151;font-weight:500">That's the difference between networking and <em>networking with leverage</em>.</p>

<p style="margin:20px 0 0;font-size:14px;color:#6b7280">Try it at Squad Up and tell me what happens. I want to hear about it.</p>`;

  return {
    subject: 'Try this at Squad Up — the networking power move',
    html: layout(content, "A networking automation play for Squad Up that'll change how you follow up."),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CF-E4: Day 7 — Check-in + Testimonial Ask
//  "How'd it go?"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function checkIn({ firstName, tier }) {
  const isTier2 = tier === '2';

  const consultationBlock = isTier2 ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:20px 24px;margin:0">
<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#92400e">&#127919; Haven't booked your consultation yet?</p>
<p style="margin:0 0 12px;font-size:13px;color:#78350f;line-height:1.5">You've had the system for a week. Now let's dial it in. Bring your business &mdash; your actual workflows, your actual problems &mdash; and I'll configure this thing specifically for how you operate.</p>
${btn('Book Your 1-on-1 Session &rarr;', CALENDLY_URL)}
</td></tr></table>

<div style="height:20px"></div>` : '';

  const content = `
<p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK}">How'd it go${firstName ? `, ${firstName}` : ''}?</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">You've had the AI OS for about a week now. Squad Up just happened (or is about to). I want to know &mdash; honestly &mdash; how it's going.</p>

${consultationBlock}

<p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${DARK}">The one ask:</p>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">I gave this to you for free because I need real feedback from real operators. Not fluff. Not "it's cool." I need to know what it actually DID for you.</p>

<p style="margin:0 0 16px;font-size:14px;font-weight:600;color:${DARK}">Send me a quick video or text covering:</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${stepRow('1', 'What was your workflow before?', 'How were you handling the stuff your AI does now?')}
${stepRow('2', 'What does your AI handle for you?', 'Be specific &mdash; research, content, pipeline, follow-ups, whatever.')}
${stepRow('3', 'What surprised you?', 'What did it do that you didn\'t expect?')}
${stepRow('4', 'Time or money saved?', 'Even a rough estimate. Hours per week, tasks eliminated, etc.')}
${stepRow('5', 'What would you tell someone on the fence?', 'One sentence. Keep it real.')}
</table>

<p style="margin:24px 0 0;font-size:15px;color:#374151;line-height:1.65">A 60-second video is gold. But even a text reply to this email works. Whatever's easiest.</p>

<p style="margin:16px 0 0;font-size:15px;color:#374151;line-height:1.65;font-weight:500">Your feedback is literally how I improve this for the next group. We all we got.</p>

<p style="margin:20px 0 0;font-size:14px;color:#6b7280">Just reply to this email or DM me directly. I read every one.</p>`;

  return {
    subject: `How's the AI OS treating you${firstName ? `, ${firstName}` : ''}?`,
    html: layout(content, "You've had the system for a week. I want to hear what happened."),
  };
}

// ── Export ──
function getDripEmail(emailNum, data) {
  switch (emailNum) {
    case 1: return purchaseConfirmation(data);
    case 2: return preSummitPrep(data);
    case 3: return networkingPowerMove(data);
    case 4: return checkIn(data);
    default: return null;
  }
}

module.exports = { getDripEmail };
