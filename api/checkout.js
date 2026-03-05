const Stripe = require('stripe');

module.exports = async (req, res) => {
  try {
    // Only allow GET (redirect flow)
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());
    const { tier } = req.query;

    // Map tiers to Stripe Price IDs (set in Vercel env vars) — trim to prevent issues
    const priceMap = {
      '1': (process.env.STRIPE_PRICE_TIER1 || '').trim(),
      '2': (process.env.STRIPE_PRICE_TIER2 || '').trim(),
    };

    const priceId = priceMap[tier];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier. Use ?tier=1 or ?tier=2' });
    }

    const siteUrl = (process.env.SITE_URL || 'https://aiosblueprint.com').trim();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/thank-you?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#pricing`,
      metadata: { tier },
      allow_promotion_codes: true,
      customer_creation: 'always',
    });

    // Redirect to Stripe Checkout
    res.writeHead(303, { Location: session.url });
    res.end();
  } catch (err) {
    console.error('Stripe checkout error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create checkout session', detail: err.message });
  }
};
