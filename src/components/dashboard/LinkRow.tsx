import { useState } from 'react';
import StatusBadge from '@/components/shared/StatusBadge';
import TokenBadge from '@/components/shared/TokenBadge';
import type { ZapLink } from '@/types';
import styles from './LinkRow.module.css';

interface Props {
  link: ZapLink;
  onClick: () => void;
}

export default function LinkRow({ link, onClick }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/pay/${link.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className={styles.row} onClick={onClick}>
      <div className={styles.info}>
        <div className={styles.note}>
          {link.note || 'Payment request'}
        </div>
        <div className={styles.meta}>
          {new Date(link.createdAt).toLocaleDateString()} · {link.views} views
        </div>
      </div>
      <div className={styles.amount}>
        {link.amount}
        <TokenBadge token={link.token} size="sm" />
      </div>
      <StatusBadge status={link.status} />
      <button className={styles.copyBtn} onClick={handleCopy}>
        {copied ? '✓' : '⧉'}
      </button>
    </div>
  );
}
