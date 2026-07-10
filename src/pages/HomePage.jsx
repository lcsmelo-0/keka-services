import { Link } from 'react-router-dom';
import { useInvoiceUnlock } from '../context/InvoiceUnlockProvider';
import { getServiceTranslation } from '../i18n/getTranslation';
import { useTranslation } from '../i18n/LanguageProvider';
import { getVisiblePlatformServices } from '../data/navigation';
import './HomePage.css';

export const HomePage = () => {
  const { t } = useTranslation();
  const { handleEasterEggClick, isInvoiceUnlocked } = useInvoiceUnlock();

  const availableServices = getVisiblePlatformServices(isInvoiceUnlocked);

  return (
    <div className="home-page">
      <header className="home-page__hero">
        <p className="home-page__eyebrow">{t('home.welcomeTo')}</p>
        <button
          className="home-page__title home-page__title-button"
          onClick={handleEasterEggClick}
          type="button"
        >
          {t('app.brandName')}
        </button>
        <p className="home-page__description">{t('home.description')}</p>
      </header>

      <section className="home-page__services">
        <h2 className="home-page__services-title">{t('home.availableServices')}</h2>
        <div className="home-page__services-grid">
          {availableServices.map((service) => {
            return (
              <Link
                className="home-page__service-card"
                key={service.id}
                to={service.path}
              >
                <h3 className="home-page__service-card-title">
                  {getServiceTranslation(t, service.id, 'label')}
                </h3>
                <p className="home-page__service-card-description">
                  {getServiceTranslation(t, service.id, 'description')}
                </p>
                <span className="home-page__service-card-action">{t('home.openService')}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
