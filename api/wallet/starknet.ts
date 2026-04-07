import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrivyClient } from '@privy-io/server-auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const appId = process.env.VITE_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    return res.status(500).json({ error: 'Privy not configured' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    const accessToken = authHeader.slice(7);
    const privy = new PrivyClient(appId, appSecret);
    const { userId } = await privy.verifyAuthToken(accessToken);

    const user = await privy.getUser(userId);
    const existing = user.linkedAccounts.find(
      a => a.type === 'wallet' && a.walletClientType === 'privy' && a.chainType === 'ethereum'
    );

    if (existing && 'address' in existing && 'publicKey' in existing) {
      return res.status(200).json({
        wallet: {
          id: existing.address,
          publicKey: existing.publicKey ?? existing.address,
        },
      });
    }

    const created = await privy.walletApi.create({ chainType: 'ethereum' });
    return res.status(200).json({
      wallet: {
        id: created.id,
        publicKey: created.address,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Wallet error';
    return res.status(500).json({ error: message });
  }
}
