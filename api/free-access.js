const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { source, tier, key } = req.query;
    const validSources = ['cookout', 'devon', 'preview'];

    if (!source || !validSources.includes(source)) {
      return res.status(400).json({ error: 'Invalid source' });
    }

    // Require access key for non-preview sources (prevents unauthorized Tier 2 downloads)
    if (source !== 'preview') {
      const accessKey = (process.env.FREE_ACCESS_KEY || '').trim();
      if (!accessKey || key !== accessKey) {
        return res.status(403).json({ error: 'Invalid or missing access key' });
      }
    }

    // Determine tier: cookout/devon get Tier 2 (full system), preview gets preview
    const accessTier = source === 'preview' ? 'preview' : (tier || '2');

    // Generate signed download token
    const secret = (process.env.DOWNLOAD_SECRET || '').trim();
    if (!secret) {
      console.error('DOWNLOAD_SECRET env var is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${accessTier}.${timestamp}`)
      .digest('hex')
      .slice(0, 16);

    const token = Buffer.from(`${accessTier}.${timestamp}.${signature}`).toString('base64url');

    // Redirect to thank-you page with token
    const siteUrl = (process.env.SITE_URL || 'https://aiosblueprint.com').trim();
    const redirectUrl = `${siteUrl}/thank-you?tier=${accessTier}&token=${token}&source=${source}`;

    res.writeHead(303, { Location: redirectUrl });
    res.end();
  } catch (err) {
    console.error('free-access error:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
