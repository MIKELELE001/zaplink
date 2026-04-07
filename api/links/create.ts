import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';

type TokenSymbol = 'USDC' | 'STRK' | 'ETH';
type ExpiryOption = '24h' | '3d' | '7d' | 'never';

interface CreateLinkRequest {
  creatorAddress: string;
  creatorEmail?: string;
  amount: string;
  token: TokenSymbol;
  note?: string;
  expiry: ExpiryOption;
  splitTotal?: number;
}

function getExpiryDate(expiry: string): string | null {
  const now = new Date();
  if (expiry === '24h') { now.setHours(now.getHours() + 24); return now.toISOString(); }
  if (expiry === '3d')  { now.setDate(now.getDate() + 3);    return now.toISOString(); }
  if (expiry === '7d')  { now.setDate(now.getDate() + 7);    return now.toISOString(); }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const db_url = process.env.DATABASE_URL;
  if (!db_url) return res.status(500).json({ success: false, error: 'Database not configured' });

  try {
    const body = req.body as CreateLinkRequest;
    const { creatorAddress, creatorEmail, amount, token, note, expiry, splitTotal } = body;

    if (!creatorAddress || !amount || !token) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const id = `zap_${nanoid(10)}`;
    const expiresAt = getExpiryDate(expiry ?? 'never');
    const sql = neon(db_url);

    await sql`
      INSERT INTO links (id, creator_address, creator_email, amount, token, note, expires_at, split_total)
      VALUES (${id}, ${creatorAddress}, ${creatorEmail ?? null}, ${amount}, ${token},
              ${note ?? null}, ${expiresAt}, ${splitTotal ?? null})
    `;

    const rows = await sql`SELECT * FROM links WHERE id = ${id}`;
    const link = rows[0];

    return res.status(201).json({
      success: true,
      link: {
        id: link.id,
        creatorAddress: link.creator_address,
        creatorEmail: link.creator_email,
        amount: link.amount,
        token: link.token,
        note: link.note,
        expiresAt: link.expires_at,
        status: link.status,
        splitTotal: link.split_total,
        splitPaid: link.split_paid,
        views: link.views,
        createdAt: link.created_at,
        updatedAt: link.updated_at,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return res.status(500).json({ success: false, error: message });
  }
}
