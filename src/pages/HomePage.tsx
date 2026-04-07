import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.inner}>
          <div className={styles.eyebrow}>⚡ Built on Starknet</div>
          <h1 className={styles.title}>
            Send an onchain<br />
            payment link in<br />
            <span className={styles.accent}>30 seconds.</span>
          </h1>
          <p className={styles.sub}>
            Create a link. Share it. Your recipient pays with just their email —
            no wallet setup, no gas fees, no crypto knowledge needed.
          </p>
          <div className={styles.cta}>
            <button className={styles.primary} onClick={() => navigate('/create')}>
              Create a Link →
            </button>
            <button className={styles.ghost} onClick={() => navigate('/dashboard')}>
              View dashboard
            </button>
          </div>
          <div className={styles.proof}>
            {[
              { num: '~30s', label: 'Link creation' },
              { num: '$0',   label: 'Gas fees' },
              { num: '3',    label: 'Tokens supported' },
            ].map(p => (
              <div className={styles.proofItem} key={p.label}>
                <div className={styles.proofNum}>{p.num}</div>
                <div className={styles.proofLabel}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.how}>
        <h2 className={styles.sectionTitle}>How ZapLink works</h2>
        <div className={styles.steps}>
          {[
            { n: '1', title: 'Sign in with email', desc: 'No wallet download. No seed phrase. Just your email — Privy handles the rest.' },
            { n: '2', title: 'Set amount & note', desc: 'Choose USDC, STRK, or ETH. Add a note. Set an optional expiry.' },
            { n: '3', title: 'Share your link', desc: 'Get a unique link and QR code. Send it anywhere — WhatsApp, email, Twitter.' },
            { n: '4', title: 'Recipient pays instantly', desc: 'They log in with email, click Pay Now. Gas is on us. Done.' },
          ].map(s => (
            <div className={styles.step} key={s.n}>
              <div className={styles.stepNum}>{s.n}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
