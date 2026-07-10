import { Link, useNavigate } from 'react-router-dom';
import { useInvoiceUnlock } from '../context/InvoiceUnlockProvider';
import { useTripleClick } from '../hooks/useTripleClick';
import { getServiceTranslation } from '../i18n/getTranslation';
import { useTranslation } from '../i18n/LanguageProvider';
import { getVisiblePlatformServices, LOVE_EASTER_EGG_PATH } from '../data/navigation';
import './HomePage.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleEasterEggClick, isInvoiceUnlocked } = useInvoiceUnlock();

  const handleLoveEasterEggClick = useTripleClick(() => {
    navigate(LOVE_EASTER_EGG_PATH);
  });

  const availableServices = getVisiblePlatformServices(isInvoiceUnlocked);

  return (
    <div className="home-page">
      <header className="home-page__hero">
        <p
          className="home-page__eyebrow home-page__eyebrow--interactive"
          onClick={handleLoveEasterEggClick}
        >
          {t('home.welcomeTo')}
        </p>
        <h1
          className="home-page__title home-page__title--interactive"
          onClick={handleEasterEggClick}
        >
          {t('app.brandName')}
        </h1>
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
