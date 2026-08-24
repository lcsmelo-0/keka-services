import { useEffect, useState } from 'react';
import { QrHistoryList } from '../../components/QrHistoryList';
import { useTranslation } from '../../i18n/LanguageProvider';
import { formatDateTime } from '../../utils/formatDateTime';
import {
  downloadQrCode,
  generateQrCodeDataUrl,
  QR_CODE_DOWNLOAD_FORMATS,
} from '../../utils/generateQrCode';
import {
  createQrHistoryEntry,
  loadQrHistory,
  MAX_QR_HISTORY_ENTRIES,
  saveQrHistory,
} from '../../utils/qrHistoryStorage';
import './QrCodeGeneratorPage.css';

const QR_CODE_DOWNLOAD_LABEL_KEYS = {
  jpeg: 'qrCodeGenerator.downloadJpeg',
  pdf: 'qrCodeGenerator.downloadPdf',
  png: 'qrCodeGenerator.downloadPng',
};

export const QrCodeGeneratorPage = () => {
  const { language, t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');
  const [historyEntries, setHistoryEntries] = useState(() => {
    return loadQrHistory();
  });
  const [historyErrorMessage, setHistoryErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingHistoryId, setIsDownloadingHistoryId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    saveQrHistory(historyEntries);
  }, [historyEntries]);

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

  const handleHistoryDownload = async (entry) => {
    if (isDownloadingHistoryId) {
      return;
    }

    setIsDownloadingHistoryId(entry.id);

    try {
      const dataUrl = await generateQrCodeDataUrl(entry.value);
      await downloadQrCode(dataUrl, 'png');
    } catch {
      setHistoryErrorMessage(t('qrCodeGenerator.historyDownloadError'));
    } finally {
      setIsDownloadingHistoryId('');
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
    setHistoryErrorMessage('');

    try {
      const dataUrl = await generateQrCodeDataUrl(trimmedValue);
      const createdEntry = createQrHistoryEntry(trimmedValue);

      setQrCodeDataUrl(dataUrl);
      setHistoryEntries((currentEntries) => {
        return [createdEntry, ...currentEntries].slice(0, MAX_QR_HISTORY_ENTRIES);
      });
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

      {historyErrorMessage && (
        <p className="qr-code-generator-page__history-error">{historyErrorMessage}</p>
      )}

      <QrHistoryList
        downloadLabel={t('qrCodeGenerator.historyDownload')}
        emptyLabel={t('qrCodeGenerator.historyEmpty')}
        entries={historyEntries}
        formatCreatedAt={(createdAt) => {
          return formatDateTime(createdAt, language);
        }}
        isDownloadingId={isDownloadingHistoryId}
        loadingLabel={t('qrCodeGenerator.historyLoading')}
        onDownload={handleHistoryDownload}
        title={t('qrCodeGenerator.historyTitle')}
      />
    </div>
  );
};
