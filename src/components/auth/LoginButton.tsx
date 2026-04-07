import { usePrivy } from '@privy-io/react-auth';
import styles from './LoginButton.module.css';

interface Props {
  label?: string;
  onSuccess?: () => void;
}

export default function LoginButton({ label = 'Sign in with email', onSuccess }: Props) {
  const { login, ready, authenticated } = usePrivy();

  const handleLogin = async () => {
    await login();
    if (authenticated && onSuccess) onSuccess();
  };

  return (
    <button
      className={styles.btn}
      onClick={handleLogin}
      disabled={!ready}
    >
      <span className={styles.icon}>✉️</span>
      {label}
    </button>
  );
}
