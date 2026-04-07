import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';

type TokenSymbol = 'USDC' | 'STRK' | 'ETH';

interface UpdateLinkRequest {
  linkId: string;
  txHash: string;
  payerAddress: string;
  payerEmail?: string;
  amountPaid: string;
  tokenPaid: TokenSymbol;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const db_url = process.env.DATABASE_URL;
  if (!db_url) return res.status(500).json({ success: false, error: 'Database not configured' });

  try {
    const { linkId, txHash, payerAddress, payerEmail, amountPaid, tokenPaid } = req.body as UpdateLinkRequest;

    if (!linkId || !txHash || !payerAddress) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const sql = neon(db_url);
    const rows = await sql`SELECT * FROM links WHERE id = ${linkId}`;
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Link not found' });

    const link = rows[0];
    const isSplit = !!link.split_total && link.split_total > 1;
    const newSplitPaid = (link.split_paid ?? 0) + 1;
    const newStatus = isSplit
      ? newSplitPaid >= link.split_total ? 'paid' : 'partial'
      : 'paid';

    await sql`
      UPDATE links SET status = ${newStatus}, split_paid = ${newSplitPaid}
      WHERE id = ${linkId}
    `;

    await sql`
      INSERT INTO payments (id, link_id, payer_address, payer_email, amount_paid, token_paid, tx_hash)
      VALUES (${`pay_${nanoid(10)}`}, ${linkId}, ${payerAddress}, ${payerEmail ?? null}, ${amountPaid}, ${tokenPaid}, ${txHash})
    `;

    const updated = await sql`SELECT * FROM links WHERE id = ${linkId}`;
    const u = updated[0];

    return res.status(200).json({
      success: true,
      link: {
        id: u.id,
        creatorAddress: u.creator_address,
        amount: u.amount,
        token: u.token,
        note: u.note,
        status: u.status,
        splitTotal: u.split_total,
        splitPaid: u.split_paid,
        views: u.views,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return res.status(500).json({ success: false, error: message });
  }
}
