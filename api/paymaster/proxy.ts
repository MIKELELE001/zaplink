import type { VercelRequest, VercelResponse } from '@vercel/node';

const AVNU_URL = 'https://starknet.paymaster.avnu.fi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const apiKey = process.env.AVNU_API_KEY;
    if (apiKey) headers['x-paymaster-api-key'] = apiKey;

    const response = await fetch(AVNU_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const data: unknown = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Paymaster error';
    return res.status(500).json({ error: message });
  }
}
