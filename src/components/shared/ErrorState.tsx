import styles from './ErrorState.module.css';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
