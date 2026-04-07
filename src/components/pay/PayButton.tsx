import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { connectWalletWithPrivy, executeTransfer } from '@/services/starkzap';
import { updateLink } from '@/services/links';
import type { ZapLink } from '@/types';
import styles from './PayButton.module.css';

interface Props {
  link: ZapLink;
  onSuccess: () => void;
}

export default function PayButton({ link, onSuccess }: Props) {
  const { authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!authenticated) {
        await login();
        return;
      }

      const privyWallet = wallets.find(w => w.walletClientType === 'privy');
      if (!privyWallet || !user) throw new Error('Wallet not ready');

      const wallet = await connectWalletWithPrivy(
        privyWallet.address,
        privyWallet.address,
      );

      const { txHash } = await executeTransfer(
        wallet,
        link.creatorAddress,
        link.amount,
        link.token,
      );

      await updateLink({
        linkId: link.id,
        txHash,
        payerAddress: privyWallet.address,
        payerEmail: user.email?.address,
        amountPaid: link.amount,
        tokenPaid: link.token,
      });

      navigate(`/success?tx=${txHash}&amount=${link.amount}&token=${link.token}`);
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const isExpired = link.status === 'expired';
  const isPaid = link.status === 'paid';
  const isDisabled = isLoading || isExpired || isPaid;

  return (
    <div className={styles.wrap}>
      {error && <p className={styles.error}>{error}</p>}
      <button
        className={styles.btn}
        onClick={handlePay}
        disabled={isDisabled}
      >
        {isLoading
          ? 'Processing...'
          : isPaid
          ? '✓ Already paid'
          : isExpired
          ? 'Link expired'
          : !authenticated
          ? 'Sign in to pay'
          : `Pay ${link.amount} ${link.token} — Gasless ⚡`}
      </button>
      <p className={styles.note}>
        No STRK needed for gas · Powered by AVNU
      </p>
    </div>
  );
}
