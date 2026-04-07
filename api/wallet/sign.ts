import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrivyClient } from '@privy-io/server-auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appId = process.env.VITE_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    return res.status(500).json({ error: 'Privy not configured' });
  }

  try {
    const { walletId, hash } = req.body as { walletId: string; hash: string };

    if (!walletId || !hash) {
      return res.status(400).json({ error: 'Missing walletId or hash' });
    }

    const privy = new PrivyClient(appId, appSecret);

    const result = await privy.walletApi.rpc({
      walletId,
      method: 'eth_sign',
      params: { message: hash },
    });

    return res.status(200).json({ signature: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signing failed';
    return res.status(500).json({ error: message });
  }
}
