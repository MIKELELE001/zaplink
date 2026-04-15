import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import TokenSelector from './TokenSelector';
import SplitToggle from './SplitToggle';
import { createLink } from '../services/links';
import type { TokenSymbol, ExpiryOption } from '../types';
import styles from './CreateLinkForm.module.css';

const EXPIRY_OPTIONS: { label: string; value: ExpiryOption }[] = [
  { label: '24h', value: '24h' },
  { label: '3 days', value: '3d' },
  { label: '7 days', value: '7d' },
  { label: 'Never', value: 'never' },
];

export default function CreateLinkForm() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [token, setToken] = useState<TokenSymbol>('USDC');
  const [note, setNote] = useState('');
  const [expiry, setExpiry] = useState<ExpiryOption>('7d');
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitTotal, setSplitTotal] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = wallets[0]?.address ?? user?.id ?? '';

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!walletAddress) {
      setError('Please sign in first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await createLink({
        creatorAddress: walletAddress,
        creatorEmail: user?.email?.address,
        amount,
        token,
        note: note || undefined,
        expiry,
        splitTotal: splitEnabled ? splitTotal : undefined,
      });

      if (res.success && res.link) {
        navigate(`/create?linkId=${res.link.id}&created=true`);
      } else {
        setError(res.error ?? 'Failed to create link');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.group}>
        <label className={styles.label}>Token</label>
        <TokenSelector selected={token} onChange={setToken} />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Amount</label>
        <input
          className={styles.amountInput}
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>
          Note <span className={styles.optional}>(optional)</span>
        </label>
        <input
          className={styles.input}
          type="text"
          placeholder="What's this for?"
          value={note}
          onChange={e => setNote(e.target.value)}
          maxLength={120}
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Link expiry</label>
        <div className={styles.expiryRow}>
          {EXPIRY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.expiryBtn} ${expiry === opt.value ? styles.active : ''}`}
              onClick={() => setExpiry(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <SplitToggle
          enabled={splitEnabled}
          splitTotal={splitTotal}
          onToggle={setSplitEnabled}
          onSplitChange={setSplitTotal}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={isLoading || !amount}
      >
        {isLoading ? 'Creating...' : '⚡ Generate link'}
      </button>
    </div>
  );
}
