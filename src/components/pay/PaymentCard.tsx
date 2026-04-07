import TokenBadge from '@/components/shared/TokenBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import type { ZapLink } from '@/types';
import styles from './PaymentCard.module.css';

interface Props {
  link: ZapLink;
}

export default function PaymentCard({ link }: Props) {
  const isSplit = !!link.splitTotal && link.splitTotal > 1;
  const paidCount = link.splitPaid ?? 0;
  const totalCount = link.splitTotal ?? 1;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.fromLabel}>Payment request from</div>
        <div className={styles.address}>
          {link.creatorAddress.slice(0, 6)}...{link.creatorAddress.slice(-4)}
        </div>
      </div>

      <div className={styles.amountRow}>
        <span className={styles.amount}>{link.amount}</span>
        <TokenBadge token={link.token} />
      </div>

      <div className={styles.statusRow}>
        <StatusBadge status={link.status} />
        {link.expiresAt && (
          <span className={styles.expiry}>
            Expires {new Date(link.expiresAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {link.note && (
        <div className={styles.memo}>
          <div className={styles.memoLabel}>Note</div>
          <div className={styles.memoText}>{link.note}</div>
        </div>
      )}

      {isSplit && (
        <div className={styles.splitWrap}>
          <div className={styles.pips}>
            {Array.from({ length: totalCount }).map((_, i) => (
              <div
                key={i}
                className={`${styles.pip} ${i < paidCount ? styles.pipPaid : ''}`}
              />
            ))}
          </div>
          <div className={styles.splitInfo}>
            {paidCount} of {totalCount} paid
          </div>
        </div>
      )}
    </div>
  );
}
