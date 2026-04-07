import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@/hooks/useWallet';
import { useDashboard } from '@/hooks/useDashboard';
import PageWrapper from '@/components/layout/PageWrapper';
import StatsBar from '@/components/dashboard/StatsBar';
import LinkRow from '@/components/dashboard/LinkRow';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import LoginButton from '@/components/auth/LoginButton';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { authenticated } = usePrivy();
  const { address } = useWallet();
  const { links, stats, isLoading } = useDashboard(address);
  const navigate = useNavigate();

  if (!authenticated) {
    return (
      <PageWrapper center narrow>
        <div className={styles.loginWrap}>
          <div className={styles.loginIcon}>📊</div>
          <h2 className={styles.loginTitle}>Sign in to view your links</h2>
          <p className={styles.loginSub}>All your payment links in one place.</p>
          <LoginButton />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Your links</h1>
            <p className={styles.sub}>Track all your payment requests.</p>
          </div>
          <button
            className={styles.newBtn}
            onClick={() => navigate('/create')}
          >
            + New link
          </button>
        </div>

        <StatsBar stats={stats} />

        {isLoading ? (
          <LoadingSpinner />
        ) : links.length === 0 ? (
          <EmptyState
            icon="🔗"
            title="No links yet"
            description="Create your first payment link and start receiving payments."
            action={{ label: 'Create a link', onClick: () => navigate('/create') }}
          />
        ) : (
          <div className={styles.list}>
            {links.map(link => (
              <LinkRow
                key={link.id}
                link={link}
                onClick={() => navigate(`/pay/${link.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
