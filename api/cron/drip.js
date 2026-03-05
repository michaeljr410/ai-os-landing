/**
 * Daily drip email cron job
 * Runs once/day via Vercel Cron — checks Stripe customers and sends
 * the next email in the AIOS Blueprint onboarding sequence.
 *
 * Schedule: E2 (Day 2), E3 (Day 4), E4 (Day 7)
 * E1 is sent immediately by the webhook on purchase.
 *
 * Uses Stripe customer metadata to track drip state:
 *   aios_purchased_at  — ISO date of purchase
 *   aios_emails_sent   — comma-separated email numbers already sent (e.g. "1,2")
 *   aios_tier           — "1" or "2"
 *   aios_session_id     — Stripe checkout session ID (for download links)
 */

const Stripe = require('stripe');
const { Resend } = require('resend');
const { getDripEmail } = require('../_lib/email-templates');

module.exports = async (req, res) => {
  // Only allow GET (Vercel cron uses GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron authorization (Vercel sends CRON_SECRET as Bearer token)
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (cronSecret) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());
  const resendKey = (process.env.RESEND_API_KEY || '').trim();

  if (!resendKey) {
    console.error('[DRIP] RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const resend = new Resend(resendKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mike Davis <mike@aiosblueprint.com>';

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // Search for AIOS customers with active drip sequences
    const customers = await stripe.customers.search({
      query: 'metadata["aios_purchased_at"]:*',
      limit: 100,
    });

    for (const customer of customers.data) {
      const {
        aios_tier,
        aios_purchased_at,
        aios_emails_sent,
        aios_session_id,
      } = customer.metadata;

      if (!aios_purchased_at || !customer.email) {
        skipped++;
        continue;
      }

      const purchaseDate = new Date(aios_purchased_at);
      const daysSince = Math.floor((Date.now() - purchaseDate.getTime()) / 86400000);
      const emailsSent = (aios_emails_sent || '1').split(',').map(Number);

      // Skip if all 4 emails sent or purchase is older than 14 days
      if (emailsSent.length >= 4 || daysSince > 14) {
        skipped++;
        continue;
      }

      // Determine which email to send next (check in reverse priority)
      let emailNum = null;
      if (daysSince >= 7 && !emailsSent.includes(4)) emailNum = 4;
      else if (daysSince >= 4 && !emailsSent.includes(3)) emailNum = 3;
      else if (daysSince >= 2 && !emailsSent.includes(2)) emailNum = 2;

      if (!emailNum) {
        skipped++;
        continue;
      }

      const firstName = (customer.name || '').split(' ')[0] || '';
      const emailData = getDripEmail(emailNum, {
        firstName,
        tier: aios_tier || '1',
        sessionId: aios_session_id || '',
      });

      if (!emailData) {
        skipped++;
        continue;
      }

      try {
        await resend.emails.send({
          from: fromEmail,
          to: customer.email,
          subject: emailData.subject,
          html: emailData.html,
        });

        // Update drip tracking metadata
        emailsSent.push(emailNum);
        await stripe.customers.update(customer.id, {
          metadata: {
            ...customer.metadata,
            aios_emails_sent: emailsSent.sort((a, b) => a - b).join(','),
          },
        });

        console.log(`[DRIP] E${emailNum} -> ${customer.email} (Day ${daysSince})`);
        sent++;
      } catch (sendErr) {
        console.error(`[DRIP] Failed E${emailNum} -> ${customer.email}: ${sendErr.message}`);
        errors++;
      }
    }
  } catch (err) {
    console.error('[DRIP] Cron error:', err.message);
    return res.status(500).json({ error: err.message });
  }

  const summary = `[DRIP] Complete: ${sent} sent, ${skipped} skipped, ${errors} errors`;
  console.log(summary);
  res.status(200).json({ ok: true, sent, skipped, errors });
};
