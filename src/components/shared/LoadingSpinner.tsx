import styles from './LoadingSpinner.module.css';

interface Props {
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ fullscreen = false, size = 'md' }: Props) {
  const spinner = <div className={`${styles.spinner} ${styles[size]}`} />;

  if (fullscreen) {
    return <div className={styles.fullscreen}>{spinner}</div>;
  }

  return spinner;
}
