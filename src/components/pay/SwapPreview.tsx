import styles from './SwapPreview.module.css';
import type { TokenSymbol } from '@/types';

interface Props {
  fromToken: TokenSymbol;
  fromAmount: string;
  toToken: TokenSymbol;
  toAmount: string;
}

export default function SwapPreview({ fromToken, fromAmount, toToken, toAmount }: Props) {
  if (fromToken === toToken) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>💱 Auto-swap via AVNU</div>
      <div className={styles.row}>
        <span className={styles.from}>You pay <strong>{fromAmount} {fromToken}</strong></span>
        <span className={styles.arrow}>→</span>
        <span className={styles.to}>They receive <strong>{toAmount} {toToken}</strong></span>
      </div>
      <div className={styles.note}>Rate locked for 30 seconds</div>
    </div>
  );
}
