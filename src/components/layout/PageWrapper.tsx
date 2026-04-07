import styles from './PageWrapper.module.css';

interface Props {
  children: React.ReactNode;
  center?: boolean;
  narrow?: boolean;
}

export default function PageWrapper({ children, center = false, narrow = false }: Props) {
  return (
    <main className={`${styles.wrap} ${center ? styles.center : ''} ${narrow ? styles.narrow : ''}`}>
      {children}
    </main>
  );
}
