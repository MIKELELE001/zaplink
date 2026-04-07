import styles from './TokenBadge.module.css';
import type { TokenSymbol } from '@/types';

interface Props {
  token: TokenSymbol;
  size?: 'sm' | 'md';
}

const EMOJI: Record<TokenSymbol, string> = {
  USDC: '💵',
  STRK: '⚡',
  ETH: '◆',
};

export default function TokenBadge({ token, size = 'md' }: Props) {
  return (
    <span className={`${styles.badge} ${styles[size]}`}>
      {EMOJI[token]} {token}
    </span>
  );
}
