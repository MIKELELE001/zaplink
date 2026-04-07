import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const db_url = process.env.DATABASE_URL;
  if (!db_url) return res.status(500).json({ success: false, error: 'Database not configured' });

  try {
    const { address } = req.query as { address: string };
    if (!address) return res.status(400).json({ success: false, error: 'Missing address' });

    const sql = neon(db_url);
    const rows = await sql`
      SELECT * FROM links
      WHERE creator_address = ${address}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const links = rows.map(link => ({
      id: link.id,
      creatorAddress: link.creator_address,
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
    }));

    return res.status(200).json({ success: true, links });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return res.status(500).json({ success: false, error: message });
  }
}
