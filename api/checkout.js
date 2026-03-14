const Stripe = require('stripe');

module.exports = async (req, res) => {
  try {
    // Only allow GET (redirect flow)
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());
    const { tier, source, ref } = req.query;

    // Map tiers to Stripe Price IDs (set in Vercel env vars) — trim to prevent issues
    const priceMap = {
      '1': (process.env.STRIPE_PRICE_TIER1 || '').trim(),
      '2': (process.env.STRIPE_PRICE_TIER2 || '').trim(),
    };

    const priceId = priceMap[tier];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier. Use ?tier=1 or ?tier=2' });
    }

    // ── Affiliate referral tracking ──
    // Priority: 1) ?ref= query param (appended by JS click interceptor)
    //           2) aios_ref cookie (set by referral-tracking.js on landing)
    let affiliateRef = (ref || '').trim().toLowerCase();
    if (!affiliateRef) {
      // Parse cookie header for aios_ref
      const cookies = (req.headers.cookie || '').split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        if (k && v) acc[k] = decodeURIComponent(v);
        return acc;
      }, {});
      affiliateRef = (cookies['aios_ref'] || '').trim().toLowerCase();
    }

    const siteUrl = (process.env.SITE_URL || 'https://aiosblueprint.com').trim();

    const metadata = {
      tier,
      ...(source ? { source } : {}),
      ...(affiliateRef ? { affiliate_ref: affiliateRef } : {}),
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/thank-you?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#pricing`,
      metadata,
      allow_promotion_codes: true,
      customer_creation: 'always',
      phone_number_collection: { enabled: true },
    });

    if (affiliateRef) {
      console.log(`[AFFILIATE] Checkout created with ref: ${affiliateRef} — Session: ${session.id}`);
    }

    // Redirect to Stripe Checkout
    res.writeHead(303, { Location: session.url });
    res.end();
  } catch (err) {
    console.error('Stripe checkout error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create checkout session', detail: err.message });
  }
};
