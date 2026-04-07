import { useState } from 'react';
import styles from './SplitToggle.module.css';

interface Props {
  enabled: boolean;
  splitTotal: number;
  onToggle: (enabled: boolean) => void;
  onSplitChange: (n: number) => void;
}

export default function SplitToggle({ enabled, splitTotal, onToggle, onSplitChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row} onClick={() => onToggle(!enabled)}>
        <div>
          <div className={styles.label}>Split payment</div>
          <div className={styles.sub}>Multiple people pay one link</div>
        </div>
        <div className={`${styles.switch} ${enabled ? styles.on : ''}`}>
          <div className={styles.knob} />
        </div>
      </div>
      {enabled && (
        <div className={styles.splitInput}>
          <label className={styles.inputLabel}>Split between</label>
          <input
            className={styles.input}
            type="number"
            min={2}
            max={20}
            value={splitTotal}
            onChange={e => onSplitChange(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
