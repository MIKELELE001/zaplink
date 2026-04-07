import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const db_url = process.env.DATABASE_URL;
  if (!db_url) return res.status(500).json({ error: 'Database not configured' });

  try {
    const { id } = req.query as { id: string };
    if (!id) return res.status(400).json({ error: 'Missing ID' });

    const sql = neon(db_url);
    await sql`UPDATE links SET views = views + 1 WHERE id = ${id}`;

    return res.status(200).json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return res.status(500).json({ error: message });
  }
}
