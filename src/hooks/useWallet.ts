import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import type { WalletState } from '../types';

export function useWallet(): WalletState {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  return useMemo(() => {
    if (!ready) return { address: null, email: null, isConnected: false, isLoading: true };
    if (!authenticated || !user) return { address: null, email: null, isConnected: false, isLoading: false };
    const starknetWallet = wallets.find(w => w.walletClientType === 'privy');
    const email = user.email?.address ?? null;
    return { address: starknetWallet?.address ?? null, email, isConnected: true, isLoading: false };
  }, [ready, authenticated, user, wallets]);
}
