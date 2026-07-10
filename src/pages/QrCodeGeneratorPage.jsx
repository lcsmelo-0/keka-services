import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageProvider';
import {
  downloadQrCode,
  generateQrCodeDataUrl,
  QR_CODE_DOWNLOAD_FORMATS,
} from '../utils/generateQrCode';
import './QrCodeGeneratorPage.css';

const QR_CODE_DOWNLOAD_LABEL_KEYS = {
  jpeg: 'qrCodeGenerator.downloadJpeg',
  pdf: 'qrCodeGenerator.downloadPdf',
  png: 'qrCodeGenerator.downloadPng',
};

export const QrCodeGeneratorPage = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const handleDownload = async (format) => {
    if (!qrCodeDataUrl || isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      await downloadQrCode(qrCodeDataUrl, format);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerate = async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setErrorMessage(t('qrCodeGenerator.errorEmpty'));
      setQrCodeDataUrl('');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const dataUrl = await generateQrCodeDataUrl(trimmedValue);
      setQrCodeDataUrl(dataUrl);
    } catch {
      setErrorMessage(t('qrCodeGenerator.errorGenerate'));
      setQrCodeDataUrl('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="qr-code-generator-page">
      <header className="qr-code-generator-page__header">
        <h1 className="qr-code-generator-page__title">{t('qrCodeGenerator.title')}</h1>
        <p className="qr-code-generator-page__description">
          {t('qrCodeGenerator.description')}
        </p>
      </header>

      <div className="qr-code-generator-page__layout">
        <section className="qr-code-generator-page__form">
          <div className="qr-code-generator-page__field">
            <label className="qr-code-generator-page__label" htmlFor="qr-code-value">
              {t('qrCodeGenerator.value')}
            </label>
            <textarea
              className="qr-code-generator-page__input"
              id="qr-code-value"
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              placeholder={t('qrCodeGenerator.valuePlaceholder')}
              rows={4}
              value={inputValue}
            />
          </div>

          {errorMessage && (
            <p className="qr-code-generator-page__error">{errorMessage}</p>
          )}

          <button
            className="qr-code-generator-page__button qr-code-generator-page__button--primary"
            disabled={isGenerating}
            onClick={handleGenerate}
            type="button"
          >
            {isGenerating ? t('qrCodeGenerator.generating') : t('qrCodeGenerator.generate')}
          </button>
        </section>

        <section className="qr-code-generator-page__preview">
          <div className="qr-code-generator-page__preview-card">
            {qrCodeDataUrl ? (
              <img
                alt={t('qrCodeGenerator.imageAlt')}
                className="qr-code-generator-page__image"
                src={qrCodeDataUrl}
              />
            ) : (
              <div className="qr-code-generator-page__placeholder">
                {t('qrCodeGenerator.placeholder')}
              </div>
            )}
          </div>

          <div className="qr-code-generator-page__downloads">
            {QR_CODE_DOWNLOAD_FORMATS.map((format) => {
              return (
                <button
                  className="qr-code-generator-page__button qr-code-generator-page__button--secondary"
                  disabled={!qrCodeDataUrl || isDownloading}
                  key={format.id}
                  onClick={() => {
                    handleDownload(format.id);
                  }}
                  type="button"
                >
                  {t(QR_CODE_DOWNLOAD_LABEL_KEYS[format.id])}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
