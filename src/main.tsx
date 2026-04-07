import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import './styles/global.css';
import './styles/animations.css';

const App = lazy(() => import('./App'));

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? '';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#00C896',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <Suspense fallback={<div style={{color:'white',padding:40}}>Loading...</div>}>
        <App />
      </Suspense>
    </PrivyProvider>
  </StrictMode>
);
