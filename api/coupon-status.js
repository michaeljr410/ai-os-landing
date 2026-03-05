/**
 * Live coupon counter API
 * Returns remaining redemptions for a given promo code.
 * Used by landing pages to show "X of Y spots remaining"
 */
const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  try {
    const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());

    // Look up promotion code by the code string
    const promos = await stripe.promotionCodes.list({ code, limit: 1 });

    if (!promos.data.length) {
      return res.status(404).json({ error: 'Code not found' });
    }

    const promo = promos.data[0];
    const max = promo.max_redemptions || promo.coupon.max_redemptions || 0;
    const used = promo.times_redeemed || 0;
    const remaining = max > 0 ? Math.max(0, max - used) : null;

    // No caching — always fresh count
    res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0');

    res.json({
      code: promo.code,
      remaining,
      max,
      used,
      active: promo.active && remaining > 0,
    });
  } catch (err) {
    console.error('[COUPON-STATUS] Error:', err.message);
    res.status(500).json({ error: 'Failed to check coupon status' });
  }
};
