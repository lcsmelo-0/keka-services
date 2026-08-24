import { useMemo, useState } from 'react';
import {
  STRING_DECODER_ACTIONS,
  STRING_DECODER_MODES,
} from '../../data/stringDecoder';
import { useTranslation } from '../../i18n/LanguageProvider';
import { transformString } from '../../utils/decodeString';
import './StringDecoderPage.css';

export const StringDecoderPage = () => {
  const { t } = useTranslation();
  const [action, setAction] = useState(STRING_DECODER_ACTIONS.decode);
  const [copiedLabelTimeoutId, setCopiedLabelTimeoutId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState('url');

  const transformResult = useMemo(() => {
    return transformString(inputValue, mode, action);
  }, [action, inputValue, mode]);

  const handleCopy = async () => {
    if (!transformResult.output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(transformResult.output);
      setIsCopied(true);

      if (copiedLabelTimeoutId) {
        window.clearTimeout(copiedLabelTimeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        setIsCopied(false);
        setCopiedLabelTimeoutId(null);
      }, 1500);

      setCopiedLabelTimeoutId(timeoutId);
    } catch {
      setIsCopied(false);
    }
  };

  const handleUseOutputAsInput = () => {
    if (!transformResult.output) {
      return;
    }

    setInputValue(transformResult.output);
    setIsCopied(false);
  };

  return (
    <div className="string-decoder-page">
      <header className="string-decoder-page__header">
        <h1 className="string-decoder-page__title">{t('stringDecoder.title')}</h1>
        <p className="string-decoder-page__description">
          {t('stringDecoder.description')}
        </p>
      </header>

      <div className="string-decoder-page__toolbar">
        <div className="string-decoder-page__toggle" role="group">
          <button
            className={`string-decoder-page__toggle-button ${action === STRING_DECODER_ACTIONS.decode ? 'string-decoder-page__toggle-button--active' : ''}`}
            onClick={() => {
              setAction(STRING_DECODER_ACTIONS.decode);
            }}
            type="button"
          >
            {t('stringDecoder.decode')}
          </button>
          <button
            className={`string-decoder-page__toggle-button ${action === STRING_DECODER_ACTIONS.encode ? 'string-decoder-page__toggle-button--active' : ''}`}
            onClick={() => {
              setAction(STRING_DECODER_ACTIONS.encode);
            }}
            type="button"
          >
            {t('stringDecoder.encode')}
          </button>
        </div>

        <div className="string-decoder-page__field string-decoder-page__field--mode">
          <label className="string-decoder-page__label" htmlFor="string-decoder-mode">
            {t('stringDecoder.modeLabel')}
          </label>
          <select
            className="string-decoder-page__select"
            id="string-decoder-mode"
            onChange={(event) => {
              setMode(event.target.value);
            }}
            value={mode}
          >
            {STRING_DECODER_MODES.map((decoderMode) => {
              return (
                <option key={decoderMode.id} value={decoderMode.id}>
                  {t(`stringDecoder.modes.${decoderMode.translationKey}`)}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="string-decoder-page__layout">
        <section className="string-decoder-page__panel">
          <label className="string-decoder-page__label" htmlFor="string-decoder-input">
            {t('stringDecoder.inputLabel')}
          </label>
          <textarea
            className="string-decoder-page__textarea"
            id="string-decoder-input"
            onChange={(event) => {
              setInputValue(event.target.value);
              setIsCopied(false);
            }}
            placeholder={t('stringDecoder.inputPlaceholder')}
            rows={12}
            value={inputValue}
          />
        </section>

        <section className="string-decoder-page__panel">
          <div className="string-decoder-page__output-header">
            <label className="string-decoder-page__label" htmlFor="string-decoder-output">
              {t('stringDecoder.outputLabel')}
            </label>
            <div className="string-decoder-page__output-actions">
              <button
                className="string-decoder-page__button"
                disabled={!transformResult.output}
                onClick={handleUseOutputAsInput}
                type="button"
              >
                {t('stringDecoder.useAsInput')}
              </button>
              <button
                className="string-decoder-page__button string-decoder-page__button--primary"
                disabled={!transformResult.output}
                onClick={handleCopy}
                type="button"
              >
                {isCopied ? t('stringDecoder.copied') : t('stringDecoder.copy')}
              </button>
            </div>
          </div>
          <textarea
            className="string-decoder-page__textarea"
            id="string-decoder-output"
            placeholder={t('stringDecoder.outputPlaceholder')}
            readOnly
            rows={12}
            value={transformResult.output}
          />
          {action === STRING_DECODER_ACTIONS.decode && transformResult.passCount > 0 && (
            <p className="string-decoder-page__hint">
              {t('stringDecoder.passCount', { count: transformResult.passCount })}
            </p>
          )}
          {transformResult.hasError && (
            <p className="string-decoder-page__error">{t('stringDecoder.errorInvalid')}</p>
          )}
        </section>
      </div>
    </div>
  );
};
