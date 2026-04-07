import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const db_url = process.env.DATABASE_URL;
  if (!db_url) return res.status(500).json({ success: false, error: 'Database not configured' });

  try {
    const { id } = req.query as { id: string };
    if (!id) return res.status(400).json({ success: false, error: 'Missing link ID' });

    const sql = neon(db_url);
    const rows = await sql`SELECT * FROM links WHERE id = ${id}`;

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Link not found' });
    }

    const link = rows[0];

    if (link.expires_at && new Date(link.expires_at) < new Date() && link.status === 'pending') {
      await sql`UPDATE links SET status = 'expired' WHERE id = ${id}`;
      link.status = 'expired';
    }

    return res.status(200).json({
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
