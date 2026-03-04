const Stripe = require('stripe');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id, token } = req.query;

  // Two verification paths: Stripe session OR signed free-access token
  let tier = null;

  if (session_id) {
    // Path 1: Paid purchase — verify Stripe session
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== 'paid') {
        return res.status(403).json({ error: 'Payment not completed' });
      }

      tier = session.metadata?.tier;
    } catch (err) {
      console.error('Session verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid session' });
    }
  } else if (token) {
    // Path 2: Free access — verify signed token
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const parts = decoded.split('.');
      if (parts.length !== 3) throw new Error('Bad token format');

      const [tokenTier, timestamp, signature] = parts;
      const secret = process.env.DOWNLOAD_SECRET;

      // Verify signature
      const expected = crypto
        .createHmac('sha256', secret)
        .update(`${tokenTier}.${timestamp}`)
        .digest('hex')
        .slice(0, 16);

      if (signature !== expected) throw new Error('Bad signature');

      // Check expiration (tokens valid for 7 days)
      const issued = parseInt(timestamp, 10);
      const now = Math.floor(Date.now() / 1000);
      if (now - issued > 7 * 24 * 60 * 60) {
        return res.status(403).json({ error: 'Download link expired' });
      }

      tier = tokenTier;
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(400).json({ error: 'Missing session_id or token' });
  }

  // Map tier to download URL (set in Vercel env vars)
  const downloadMap = {
    '1': process.env.TIER1_DOWNLOAD_URL,
    '2': process.env.TIER2_DOWNLOAD_URL,
    'preview': process.env.PREVIEW_DOWNLOAD_URL,
  };

  const downloadUrl = downloadMap[tier];
  if (!downloadUrl) {
    return res.status(404).json({ error: 'Download not found for this tier' });
  }

  // Redirect to file
  res.writeHead(302, { Location: downloadUrl });
  res.end();
};
