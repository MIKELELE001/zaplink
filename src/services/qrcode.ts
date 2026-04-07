import QRCode from 'qrcode';

export async function generateQRDataURL(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#07090E', light: '#FFFFFF' } });
  } catch { return ''; }
}

export async function downloadQRCode(url: string, filename: string): Promise<void> {
  const dataUrl = await generateQRDataURL(url);
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}-qr.png`;
  link.click();
}
