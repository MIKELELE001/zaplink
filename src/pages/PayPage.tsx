import { useParams } from 'react-router-dom';
import { useLink } from '@/hooks/useLink';
import PageWrapper from '@/components/layout/PageWrapper';
import PaymentCard from '@/components/pay/PaymentCard';
import PayButton from '@/components/pay/PayButton';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';
import styles from './PayPage.module.css';

export default function PayPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const { link, isLoading, error, refetch } = useLink(linkId);

  if (isLoading) return <PageWrapper center><LoadingSpinner size="lg" /></PageWrapper>;
  if (error || !link) return <PageWrapper center><ErrorState message={error ?? 'Link not found'} onRetry={refetch} /></PageWrapper>;

  return (
    <PageWrapper center>
      <div className={styles.inner}>
        <PaymentCard link={link} />
        <div className={styles.payWrap}>
          <PayButton link={link} onSuccess={refetch} />
        </div>
        <p className={styles.poweredBy}>
          Powered by <strong>Starkzap</strong> on Starknet
        </p>
      </div>
    </PageWrapper>
  );
}
