/**
 * Daily sales digest cron job
 * Runs once/day via Vercel Cron — queries Stripe for AIOS Blueprint sales
 * and sends a Telegram summary to Mike.
 *
 * This is INDEPENDENT of Claude Code — runs on Vercel serverless.
 * Mike always gets a daily sales update even if Claude is offline.
 *
 * Schedule: Daily at 11:00 PM UTC (7:00 PM ET / 4:00 PM PT)
 */

const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron authorization — deny by default
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  const auth = req.headers.authorization;
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());
  const telegramToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const telegramChat = (process.env.TELEGRAM_CHAT_ID || '').trim();

  try {
    // ── Get ALL completed checkout sessions ──
    let allSessions = [];
    let hasMore = true;
    let startingAfter = null;

    while (hasMore) {
      const params = { limit: 100, status: 'complete' };
      if (startingAfter) params.starting_after = startingAfter;

      const batch = await stripe.checkout.sessions.list(params);
      allSessions = allSessions.concat(batch.data);
      hasMore = batch.has_more;
      if (batch.data.length > 0) {
        startingAfter = batch.data[batch.data.length - 1].id;
      }
    }

    // ── Categorize sales ──
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const weekStart = todayStart - (7 * 86400);

    let totalRevenue = 0;
    let totalPaid = 0;
    let totalFree = 0;
    let todayRevenue = 0;
    let todayPaid = 0;
    let todayFree = 0;
    let weekRevenue = 0;
    let weekPaid = 0;
    let tier1Count = 0;
    let tier2Count = 0;
    let tier1Revenue = 0;
    let tier2Revenue = 0;
    const todaySales = [];

    for (const s of allSessions) {
      const amount = (s.amount_total || 0) / 100;
      const tier = s.metadata?.tier || '?';
      const created = s.created || 0;
      const name = s.customer_details?.name || 'N/A';
      const email = s.customer_details?.email || 'unknown';

      if (amount > 0) {
        totalPaid++;
        totalRevenue += amount;
        if (tier === '1') { tier1Count++; tier1Revenue += amount; }
        if (tier === '2') { tier2Count++; tier2Revenue += amount; }
        if (created >= todayStart) {
          todayPaid++;
          todayRevenue += amount;
          todaySales.push({ name, email, tier, amount });
        }
        if (created >= weekStart) {
          weekPaid++;
          weekRevenue += amount;
        }
      } else {
        totalFree++;
        if (created >= todayStart) todayFree++;
      }
    }

    // ── Build Telegram message ──
    let msg = `📊 *AIOS Blueprint — Daily Sales Digest*\n`;
    msg += `_${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}_\n\n`;

    // Today's activity
    if (todayPaid > 0 || todayFree > 0) {
      msg += `🔥 *Today*\n`;
      if (todayPaid > 0) msg += `  💰 ${todayPaid} paid sale${todayPaid > 1 ? 's' : ''} — $${todayRevenue.toLocaleString()}\n`;
      if (todayFree > 0) msg += `  🎁 ${todayFree} free seed${todayFree > 1 ? 's' : ''}\n`;
      if (todaySales.length > 0) {
        msg += `\n`;
        for (const sale of todaySales) {
          const tierLabel = sale.tier === '2' ? 'Tier 2' : 'Tier 1';
          msg += `  • ${sale.name} — ${tierLabel} — $${sale.amount.toLocaleString()}\n`;
        }
      }
      msg += `\n`;
    } else {
      msg += `📭 *Today:* No new sales\n\n`;
    }

    // This week
    msg += `📅 *This Week:* ${weekPaid} paid — $${weekRevenue.toLocaleString()}\n\n`;

    // All-time totals
    msg += `📈 *All-Time Totals*\n`;
    msg += `  💰 Revenue: *$${totalRevenue.toLocaleString()}*\n`;
    msg += `  🛒 Paid: ${totalPaid} (${tier1Count} Tier 1, ${tier2Count} Tier 2)\n`;
    msg += `  🎁 Free Seeds: ${totalFree}\n`;
    msg += `  📦 Total Units: ${totalPaid + totalFree}\n\n`;

    // Breakdown by tier
    if (tier1Count > 0 || tier2Count > 0) {
      msg += `*By Tier:*\n`;
      if (tier1Count > 0) msg += `  Blueprint ($497): ${tier1Count} sold — $${tier1Revenue.toLocaleString()}\n`;
      if (tier2Count > 0) msg += `  Full System ($1,497): ${tier2Count} sold — $${tier2Revenue.toLocaleString()}\n`;
    }

    // ── Send to Telegram ──
    if (telegramToken && telegramChat) {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: msg,
          parse_mode: 'Markdown',
        }),
      });
      console.log('[SALES-DIGEST] Telegram summary sent');
    }

    res.status(200).json({
      ok: true,
      totalRevenue,
      totalPaid,
      totalFree,
      todayRevenue,
      todayPaid,
    });
  } catch (err) {
    console.error('[SALES-DIGEST] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
