const Stripe = require('stripe');
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Create or find Stripe customer — this stores the lead in Stripe
    const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (stripeKey) {
      const stripe = new Stripe(stripeKey);

      // Check if customer already exists
      const existing = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });

      if (existing.data.length === 0) {
        await stripe.customers.create({
          email: email.toLowerCase(),
          name: name || undefined,
          metadata: {
            source: 'free_preview',
            captured_at: new Date().toISOString(),
          },
        });
      }
    }

    // Generate signed download token for the preview
    const secret = (process.env.DOWNLOAD_SECRET || '').trim();
    if (!secret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const accessTier = 'preview';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${accessTier}.${timestamp}`)
      .digest('hex')
      .slice(0, 16);

    const token = Buffer.from(`${accessTier}.${timestamp}.${signature}`).toString('base64url');

    const siteUrl = (process.env.SITE_URL || 'https://aiosblueprint.com').trim();
    const redirectUrl = `${siteUrl}/thank-you?tier=${accessTier}&token=${token}&source=preview`;

    return res.status(200).json({ success: true, redirectUrl });
  } catch (err) {
    console.error('capture-email error:', err.message, err.stack);
    return res.status(500).json({ error: 'Failed to process request', detail: err.message });
  }
};
