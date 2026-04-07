import { useSearchParams } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import PageWrapper from '@/components/layout/PageWrapper';
import CreateLinkForm from '@/components/create/CreateLinkForm';
import QRCodeDisplay from '@/components/shared/QRCode';
import LoginButton from '@/components/auth/LoginButton';
import styles from './CreatePage.module.css';

export default function CreatePage() {
  const { authenticated } = usePrivy();
  const [params] = useSearchParams();
  const linkId = params.get('linkId');
  const created = params.get('created') === 'true';

  if (created && linkId) {
    const linkUrl = `${window.location.origin}/pay/${linkId}`;
    return (
      <PageWrapper narrow>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.title}>Link created!</h2>
          <p className={styles.sub}>Share this with anyone. They pay, you receive.</p>
          <div className={styles.card}>
            <div className={styles.linkRow}>
              <span className={styles.linkText}>{linkUrl}</span>
              <button
                className={styles.copyBtn}
                onClick={() => navigator.clipboard.writeText(linkUrl).catch(() => {})}
              >
                Copy
              </button>
            </div>
            <QRCodeDisplay url={linkUrl} linkId={linkId} />
          </div>
          <div className={styles.actions}>
            <a href="/create" className={styles.ghostBtn}>Create another</a>
            <a href="/dashboard" className={styles.primaryBtn}>View dashboard</a>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper narrow>
      <h1 className={styles.title}>Create a payment link</h1>
      <p className={styles.sub}>Fill in the details and share your link in seconds.</p>
      {authenticated ? (
        <div className={styles.card}>
          <CreateLinkForm />
        </div>
      ) : (
        <div className={styles.card}>
          <p className={styles.loginPrompt}>Sign in to create your payment link</p>
          <LoginButton />
        </div>
      )}
    </PageWrapper>
  );
}
