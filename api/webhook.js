const Stripe = require('stripe');
const { Resend } = require('resend');
const { getDripEmail } = require('./_lib/email-templates');

// Disable Vercel body parsing — Stripe needs the raw body for signature verification
module.exports.config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

  let event;
  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const tier = session.metadata?.tier;
      const email = session.customer_details?.email;
      const name = session.customer_details?.name || '';
      const firstName = name.split(' ')[0] || '';

      console.log(`[SALE] Tier ${tier} purchased by ${email} — Session: ${session.id}`);

      // ── Send confirmation email (E1) via Resend ──
      const resendKey = (process.env.RESEND_API_KEY || '').trim();
      if (resendKey && email) {
        try {
          const resend = new Resend(resendKey);
          const emailData = getDripEmail(1, {
            firstName,
            tier,
            sessionId: session.id,
          });

          if (emailData) {
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'Mike Davis <mike@aiosblueprint.com>',
              to: email,
              subject: emailData.subject,
              html: emailData.html,
            });
            console.log(`[EMAIL] E1 confirmation sent to ${email}`);
          }
        } catch (emailErr) {
          // Don't fail the webhook if email fails — log and continue
          console.error('[EMAIL] Failed to send confirmation:', emailErr.message);
        }
      }

      // ── Update Stripe customer metadata for drip sequence tracking ──
      if (session.customer) {
        try {
          const customerId = typeof session.customer === 'string'
            ? session.customer
            : session.customer.id;

          await stripe.customers.update(customerId, {
            metadata: {
              aios_tier: tier,
              aios_purchased_at: new Date().toISOString(),
              aios_emails_sent: '1',
              aios_session_id: session.id,
            },
          });
          console.log(`[CRM] Customer ${customerId} metadata updated for drip tracking`);
        } catch (metaErr) {
          console.error('[CRM] Failed to update customer metadata:', metaErr.message);
        }
      }

      // ── Telegram notification to Mike ──
      const telegramToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
      const telegramChat = (process.env.TELEGRAM_CHAT_ID || '').trim();
      if (telegramToken && telegramChat) {
        try {
          const tierLabel = tier === '2' ? 'Full System ($1,497)' : 'Blueprint ($497)';
          const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : tierLabel;
          const msg = `🎯 *New AIOS Blueprint Sale*\n\n` +
            `*Tier:* ${tierLabel}\n` +
            `*Paid:* ${amount}\n` +
            `*Email:* ${email}\n` +
            `*Name:* ${name || 'N/A'}`;

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChat,
              text: msg,
              parse_mode: 'Markdown',
            }),
          });
          console.log(`[TELEGRAM] Sale notification sent`);
        } catch (tgErr) {
          console.error('[TELEGRAM] Notification failed:', tgErr.message);
        }
      }

      break;
    }

    default:
      // Ignore other event types
      break;
  }

  res.status(200).json({ received: true });
};
