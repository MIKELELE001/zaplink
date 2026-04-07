import styles from './TokenSelector.module.css';
import type { TokenSymbol } from '@/types';

interface Props {
  selected: TokenSymbol;
  onChange: (token: TokenSymbol) => void;
}

const TOKENS: { symbol: TokenSymbol; emoji: string; name: string }[] = [
  { symbol: 'USDC', emoji: '💵', name: 'USD Coin' },
  { symbol: 'STRK', emoji: '⚡', name: 'Starknet' },
  { symbol: 'ETH',  emoji: '◆', name: 'Ethereum' },
];

export default function TokenSelector({ selected, onChange }: Props) {
  return (
    <div className={styles.row}>
      {TOKENS.map(t => (
        <button
          key={t.symbol}
          className={`${styles.pill} ${selected === t.symbol ? styles.active : ''}`}
          onClick={() => onChange(t.symbol)}
          type="button"
        >
          <span>{t.emoji}</span>
          {t.symbol}
        </button>
      ))}
    </div>
  );
}
