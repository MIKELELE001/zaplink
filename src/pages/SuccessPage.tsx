import { useSearchParams, useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import styles from './SuccessPage.module.css';

export default function SuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const tx = params.get('tx') ?? '';
  const amount = params.get('amount') ?? '';
  const token = params.get('token') ?? '';

  const explorerUrl = `https://sepolia.starkscan.co/tx/${tx}`;

  return (
    <PageWrapper center>
      <div className={styles.inner}>
        <div className={styles.ring}>✓</div>
        <h1 className={styles.title}>Payment sent!</h1>
        <p className={styles.sub}>
          {amount} {token} has been sent successfully. Zero gas paid.
        </p>
        <div className={styles.card}>
          {[
            { k: 'Amount', v: `${amount} ${token}` },
            { k: 'Gas paid', v: 'Free ⚡' },
            { k: 'Status', v: 'Confirmed ✓' },
            { k: 'Network', v: 'Starknet Sepolia' },
          ].map(row => (
            <div className={styles.row} key={row.k}>
              <span className={styles.key}>{row.k}</span>
              <span className={styles.val}>{row.v}</span>
            </div>
          ))}
          {tx && (
            <div className={styles.row}>
              <span className={styles.key}>Tx hash</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.hash}
              >
                {tx.slice(0, 8)}...{tx.slice(-6)} ↗
              </a>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          {tx && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ghostBtn}
            >
              View on Starkscan ↗
            </a>
          )}
          <button
            className={styles.primaryBtn}
            onClick={() => navigate('/')}
          >
            Done
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
