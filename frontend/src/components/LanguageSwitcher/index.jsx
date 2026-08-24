import { LANGUAGE_OPTIONS } from '../../i18n/languages';
import { useTranslation } from '../../i18n/LanguageProvider';
import './LanguageSwitcher.css';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="language-switcher">
      <label className="language-switcher__label" htmlFor="language-select">
        {t('app.language')}
      </label>
      <select
        className="language-switcher__select"
        id="language-select"
        onChange={(event) => {
          setLanguage(event.target.value);
        }}
        value={language}
      >
        {LANGUAGE_OPTIONS.map((languageOption) => {
          return (
            <option key={languageOption.id} value={languageOption.id}>
              {`${languageOption.flag} ${languageOption.label}`}
            </option>
          );
        })}
      </select>
    </div>
  );
};
