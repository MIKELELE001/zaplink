/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_PRIVY_APP_ID: string;
  readonly VITE_STARKNET_NETWORK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
