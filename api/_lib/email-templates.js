/**
 * AIOS Blueprint — Email Templates
 * All 4 drip emails: confirmation, install reminder, use cases, one-week check-in
 * Table-based HTML for email client compatibility (Gmail, Apple Mail, Outlook)
 */

const SITE_URL = 'https://aiosblueprint.com';
const CALENDLY_URL = 'https://calendly.com/topwheelsmike/aios-blueprint-consultation';
const ACCENT = '#00e5ff';
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
<span style="font-family:'Courier New',Courier,monospace;font-size:12px;color:${ACCENT};letter-spacing:3px;text-transform:uppercase;font-weight:700">AI OS <span style="color:#6b7280">BLUEPRINT</span></span>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px 28px;font-size:15px;line-height:1.65;color:#1f2937">
${bodyContent}
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="vertical-align:top;padding-right:14px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:44px;height:44px;border-radius:22px;background:${DARK};text-align:center;font-size:17px;color:${ACCENT};font-weight:700;font-family:'Courier New',monospace;line-height:44px">M</td></tr></table>
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
  bgColor = bgColor || ACCENT;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0"><tr>
<td align="center" style="background:${bgColor};border-radius:6px">
<a href="${url}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:${DARK};text-decoration:none;letter-spacing:.3px">${text}</a>
</td></tr></table>`;
}

// ── Step row (numbered) ──
function stepRow(num, title, desc) {
  return `<tr>
<td style="width:36px;vertical-align:top;padding:10px 0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:28px;height:28px;border-radius:14px;background:${DARK};color:${ACCENT};font-family:'Courier New',monospace;font-size:12px;font-weight:700;text-align:center;line-height:28px">${num}</td></tr></table>
</td>
<td style="vertical-align:top;padding:10px 0 10px 12px">
<p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1f2937">${title}</p>
<p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5">${desc}</p>
</td></tr>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  E1: Purchase Confirmation (immediate)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function purchaseConfirmation({ firstName, tier, sessionId }) {
  const downloadUrl = `${SITE_URL}/thank-you?tier=${tier}&session_id=${sessionId}`;
  const tierName = tier === '2' ? 'Full System (Tier 2)' : 'Blueprint (Tier 1)';

  const calendlyBlock = tier === '2' ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:20px 24px;margin:0">
<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#92400e">&#127919; Your Setup Consultation Is Included</p>
<p style="margin:0 0 12px;font-size:13px;color:#78350f;line-height:1.5">You purchased the Full System &mdash; that includes a <strong>1-hour private setup consultation</strong> with me. Book it now so we can dial your AI OS in for YOUR specific business.</p>
${btn('Book Your Consultation &rarr;', CALENDLY_URL, '#eeb544')}
</td></tr></table>` : '';

  const content = `
<p style="margin:0 0 20px;font-size:22px;font-weight:700;color:${DARK};letter-spacing:-.3px">You're in${firstName ? `, ${firstName}` : ''}. Let's go.</p>

<p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:500">Your purchase</p>
<p style="margin:0 0 20px;font-size:16px;font-weight:600;color:${DARK}">AIOS Blueprint&trade; &mdash; ${tierName}</p>

<p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.65">Your AI OS Blueprint is ready to download. Click the button below to access your files.</p>

${btn('Download Your AI OS Blueprint &rarr;', downloadUrl)}

${calendlyBlock}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;margin-top:28px;padding-top:24px">
<tr><td colspan="2"><p style="margin:0 0 16px;font-size:15px;font-weight:600;color:${DARK}">Quick Start &mdash; 3 Steps</p></td></tr>
${stepRow('1', 'Download Claude Desktop', 'Go to <a href="https://claude.ai" style="color:' + ACCENT + ';text-decoration:underline">claude.ai</a> and download the free desktop app for your computer.')}
${stepRow('2', 'Subscribe to Claude Pro', '$20/month. This is the AI engine that powers your entire system.')}
${stepRow('3', 'Paste the Magic Install Prompt', 'Open the <strong>Code tab</strong> in Claude Desktop. Paste the prompt from your download. Everything installs automatically.')}
</table>

<p style="margin:24px 0 0;font-size:14px;color:#6b7280">Questions? Just reply to this email.</p>`;

  return {
    subject: 'Your AI OS Blueprint is ready',
    html: layout(content, 'Your AI OS Blueprint files are ready to download.'),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  E2: Day 2 — Did you install it?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function installReminder({ firstName, tier, sessionId }) {
  const downloadUrl = `${SITE_URL}/thank-you?tier=${tier}&session_id=${sessionId}`;

  const content = `
<p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK}">Quick check${firstName ? `, ${firstName}` : ''} &mdash;</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">It's been a couple days since you grabbed the AIOS Blueprint. If you haven't installed it yet, here's all it takes:</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${stepRow('1', 'Download Claude Desktop', 'Free app from <a href="https://claude.ai" style="color:' + ACCENT + ';text-decoration:underline">claude.ai</a> (Mac or Windows).')}
${stepRow('2', 'Subscribe to Claude Pro ($20/mo)', 'The AI engine that powers everything.')}
${stepRow('3', 'Paste the Magic Install Prompt', 'Code tab &rarr; paste &rarr; done. Everything installs itself.')}
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px 20px;margin:0">
<p style="margin:0;font-size:14px;color:#166534;line-height:1.55"><strong>Pro tip:</strong> Once it's running, brain dump everything about your business. Your goals. Your projects. Your contacts. Your processes. The more context you give it, the more powerful it becomes.</p>
</td></tr></table>

<p style="margin:24px 0 4px;font-size:14px;color:#6b7280">Need your download link again?</p>
${btn('Re-Download Your Files &rarr;', downloadUrl)}

<p style="margin:0;font-size:14px;color:#6b7280">Reply if you hit any snags. I'll help you get it running.</p>`;

  return {
    subject: 'Quick check — did you install your AI OS?',
    html: layout(content, "If you haven't installed it yet, it only takes 3 steps."),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  E3: Day 4 — Use cases
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function useCases({ firstName }) {
  const content = `
<p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK}">3 things to try this week</p>

<p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.65">${firstName ? `${firstName}, your` : 'Your'} AI OS has been live for a few days. Here are three things that'll show you what this system can really do:</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid ${ACCENT};padding:14px 20px;background:#f8fafc;margin:0">
<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${DARK}">1. Research a competitor</p>
<p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5">Tell it: <em>"Research [competitor name] and give me a full breakdown &mdash; their pricing, positioning, strengths, and weaknesses."</em> Watch it come back with intel that would've taken you hours.</p>
</td></tr></table>

<div style="height:12px"></div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid ${ACCENT};padding:14px 20px;background:#f8fafc;margin:0">
<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${DARK}">2. Draft a content calendar</p>
<p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5">Tell it: <em>"Create a 2-week content calendar for my business. Here's what I do: [your business]."</em> It'll map out posts, topics, and hooks &mdash; platform by platform.</p>
</td></tr></table>

<div style="height:12px"></div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid ${ACCENT};padding:14px 20px;background:#f8fafc;margin:0">
<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${DARK}">3. Build your first SOP</p>
<p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5">Tell it: <em>"Document my process for [thing you repeat weekly]."</em> Once it's saved as an SOP, your AI follows that process every time &mdash; without you explaining it again.</p>
</td></tr></table>

<p style="margin:24px 0 0;font-size:15px;color:#374151;line-height:1.65;font-weight:500">The system gets smarter every time you use it. Feed it, and it feeds you back.</p>

<p style="margin:16px 0 0;font-size:14px;color:#6b7280">Reply with what you've tried &mdash; I want to hear about it.</p>`;

  return {
    subject: '3 things to try with your AI OS this week',
    html: layout(content, 'Research a competitor. Draft a content calendar. Build your first SOP.'),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  E4: Day 7 — One week check-in
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function oneWeekCheckin({ firstName, tier }) {
  const isTier2 = tier === '2';

  const tier2Block = `
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">You've had the system for a week. Now it's time to get it dialed in for YOUR specific operation.</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">Your purchase includes a <strong>1-hour private setup consultation</strong> with me. Come prepared with your business details &mdash; your goals, your workflows, your industry &mdash; and I'll help you configure the system for maximum impact.</p>

<p style="margin:0 0 4px;font-size:15px;color:#374151;font-weight:600">This isn't generic advice. It's a working session.</p>

${btn('Book Your Setup Consultation &rarr;', CALENDLY_URL, '#eeb544')}`;

  const tier1Block = `
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">You've had the system for a week now. How's it running?</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.65">By now you should be starting to see the power of having an AI that actually knows your business. The more you use it, the more it becomes an extension of how you think and operate.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:20px 24px">
<p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0c4a6e">Want hands-on help getting set up?</p>
<p style="margin:0 0 12px;font-size:13px;color:#0369a1;line-height:1.5">The Full System tier includes a 1-hour private consultation where I personally help you configure your AI OS for your specific business.</p>
<a href="${SITE_URL}/#pricing" style="font-size:13px;color:${ACCENT};font-weight:600;text-decoration:underline">See the Full System &rarr;</a>
</td></tr></table>`;

  const content = `
<p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${DARK}">One week in${firstName ? `, ${firstName}` : ''}.</p>

${isTier2 ? tier2Block : tier1Block}

<p style="margin:28px 0 0;font-size:14px;color:#6b7280;line-height:1.5">Reply to this email with any questions. I read every one.</p>`;

  const subject = isTier2
    ? "Your setup call is waiting \u2014 let's dial this in"
    : "One week in \u2014 how's your AI OS running?";

  return {
    subject,
    html: layout(content, isTier2 ? 'Book your 1-hour private consultation.' : "You've had the system for a week \u2014 here's what's next."),
  };
}

// ── Export ──
function getDripEmail(emailNum, data) {
  switch (emailNum) {
    case 1: return purchaseConfirmation(data);
    case 2: return installReminder(data);
    case 3: return useCases(data);
    case 4: return oneWeekCheckin(data);
    default: return null;
  }
}

module.exports = { getDripEmail };
