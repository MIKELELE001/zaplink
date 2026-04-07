import styles from './StatusBadge.module.css';
import type { PaymentStatus } from '@/types';

interface Props {
  status: PaymentStatus;
}

const LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  expired: 'Expired',
  partial: 'Partial',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} />
      {LABELS[status]}
    </span>
  );
}
