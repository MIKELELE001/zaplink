import { useEffect, useState } from 'react';
import { generateQRDataURL, downloadQRCode } from '@/services/qrcode';
import styles from './QRCode.module.css';

interface Props {
  url: string;
  linkId: string;
}

export default function QRCodeDisplay({ url, linkId }: Props) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    generateQRDataURL(url).then(setDataUrl).catch(() => setDataUrl(''));
  }, [url]);

  return (
    <div className={styles.wrap}>
      {dataUrl ? (
        <img src={dataUrl} alt="Payment QR code" className={styles.qr} />
      ) : (
        <div className={styles.placeholder}>🔲</div>
      )}
      <button
        className={styles.downloadBtn}
        onClick={() => downloadQRCode(url, linkId)}
      >
        ⬇ Download QR Code
      </button>
    </div>
  );
}
