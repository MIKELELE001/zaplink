import { StarkZap, StarkSigner, Amount, sepoliaTokens, mainnetTokens } from 'starkzap';
import type { TokenSymbol } from '../types';

const NETWORK = (import.meta.env.VITE_STARKNET_NETWORK ?? 'sepolia') as 'sepolia' | 'mainnet';
const tokens = NETWORK === 'mainnet' ? mainnetTokens : sepoliaTokens;

export const TOKEN_MAP = {
  USDC: tokens.USDC,
  STRK: tokens.STRK,
  ETH: tokens.ETH,
} as const;

export function getSDK(): StarkZap {
  return new StarkZap({ network: NETWORK, paymaster: { nodeUrl: '/api/paymaster/proxy' } });
}

export async function connectWalletWithPrivy(walletId: string, publicKey: string) {
  const sdk = getSDK();
  const { PrivySigner, ArgentXV050Preset } = await import('starkzap');
  const signer = new PrivySigner({ walletId, publicKey, serverUrl: '/api/wallet/sign' });
  return sdk.connectWallet({ account: { signer, accountClass: ArgentXV050Preset }, feeMode: 'sponsored', deploy: 'if_needed' });
}

export async function executeTransfer(wallet: Awaited<ReturnType<StarkZap['connectWallet']>>, toAddress: string, amount: string, tokenSymbol: TokenSymbol) {
  const token = TOKEN_MAP[tokenSymbol];
  const { fromAddress } = await import('starkzap');
  const tx = await wallet.transfer(token, [{ to: fromAddress(toAddress), amount: Amount.parse(amount, token) }], { feeMode: 'sponsored' });
  await tx.wait();
  return { txHash: tx.hash, explorerUrl: tx.explorerUrl ?? '' };
}

export function formatAmount(amount: string, tokenSymbol: TokenSymbol): string {
  try { return Amount.parse(amount, TOKEN_MAP[tokenSymbol]).toFormatted(true); }
  catch { return `${amount} ${tokenSymbol}`; }
}
