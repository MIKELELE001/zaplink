import type { DashboardStats } from '@/types';
import styles from './StatsBar.module.css';

interface Props {
  stats: DashboardStats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.card}>
        <div className={styles.label}>Total earned</div>
        <div className={`${styles.value} ${styles.accent}`}>${stats.totalEarned}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Total links</div>
        <div className={styles.value}>{stats.totalLinks}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Pending</div>
        <div className={`${styles.value} ${styles.pending}`}>{stats.pendingLinks}</div>
      </div>
    </div>
  );
}
