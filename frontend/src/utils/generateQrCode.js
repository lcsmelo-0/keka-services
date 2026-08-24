import QRCode from 'qrcode';

export const QR_CODE_DOWNLOAD_FORMATS = [
  {
    id: 'jpeg',
  },
  {
    id: 'pdf',
  },
  {
    id: 'png',
  },
];

export const generateQrCodeDataUrl = async (value) => {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
  });
};

const loadImage = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
    image.src = dataUrl;
  });
};

const convertQrCodeDataUrl = async (pngDataUrl, mimeType) => {
  const image = await loadImage(pngDataUrl);
  const canvas = document.createElement('canvas');
  canvas.height = image.height;
  canvas.width = image.width;
  const context = canvas.getContext('2d');

  if (mimeType === 'image/jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(image, 0, 0);

  return canvas.toDataURL(mimeType, 0.92);
};

const downloadDataUrl = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

const downloadQrCodePdf = async (pngDataUrl) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const positionX = (pageWidth - 80) / 2;
  const positionY = (pageHeight - 80) / 2;
  const qrSize = 80;

  pdf.addImage(pngDataUrl, 'PNG', positionX, positionY, qrSize, qrSize);
  pdf.save('qrcode.pdf');
};

export const downloadQrCode = async (pngDataUrl, format) => {
  if (format === 'pdf') {
    await downloadQrCodePdf(pngDataUrl);
    return;
  }

  if (format === 'jpeg') {
    const jpegDataUrl = await convertQrCodeDataUrl(pngDataUrl, 'image/jpeg');
    downloadDataUrl(jpegDataUrl, 'qrcode.jpg');
    return;
  }

  downloadDataUrl(pngDataUrl, 'qrcode.png');
};
