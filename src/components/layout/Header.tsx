import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const { authenticated, login, logout } = usePrivy();
  const navigate = useNavigate();
  const location = useLocation();

  const isPayPage = location.pathname.startsWith('/pay/');

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <span className={styles.dot} />
        ZapLink
      </div>
      <div className={styles.actions}>
        {!isPayPage && authenticated && (
          <button
            className={styles.dashBtn}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        )}
        {authenticated ? (
          <button className={styles.logoutBtn} onClick={logout}>
            Sign out
          </button>
        ) : (
          <button className={styles.loginBtn} onClick={login}>
            Sign in
          </button>
        )}
        <button
          className={styles.createBtn}
          onClick={() => navigate('/create')}
        >
          Create link
        </button>
      </div>
    </header>
  );
}
