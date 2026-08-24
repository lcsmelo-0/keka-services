import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTripleClick } from '../../hooks/useTripleClick';
import { getServiceTranslation } from '../../i18n/getTranslation';
import { useTranslation } from '../../i18n/LanguageProvider';
import { getVisiblePlatformServices, HOME_PATH, LOVE_EASTER_EGG_PATH } from '../../data/navigation';
import { LanguageSwitcher } from '../LanguageSwitcher';
import './AppShell.css';

export const AppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const visibleServices = getVisiblePlatformServices();

  const handleLoveEasterEggClick = useTripleClick(() => {
    navigate(LOVE_EASTER_EGG_PATH);
  });

  const handleMenuToggle = () => {
    setIsMenuOpen((currentValue) => {
      return !currentValue;
    });
  };

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const isHomeActive = location.pathname === HOME_PATH;

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <button
          aria-expanded={isMenuOpen}
          aria-label={t('app.toggleMenu')}
          className="app-shell__menu-button"
          onClick={handleMenuToggle}
          type="button"
        >
          <span className="app-shell__menu-icon" />
        </button>

        <div className="app-shell__brand">
          <Link className="app-shell__brand-link" onClick={handleNavClick} to={HOME_PATH}>
            <span className="app-shell__brand-name">{t('app.brandName')}</span>
          </Link>
          <span className="app-shell__brand-tagline">{t('app.brandTagline')}</span>
        </div>
      </header>

      {isMenuOpen && (
        <button
          aria-label={t('app.closeMenu')}
          className="app-shell__overlay"
          onClick={handleOverlayClick}
          type="button"
        />
      )}

      <aside className={`app-shell__sidebar ${isMenuOpen ? 'app-shell__sidebar--open' : ''}`}>
        <Link className="app-shell__sidebar-brand" onClick={handleNavClick} to={HOME_PATH}>
          <span className="app-shell__sidebar-brand-name">{t('app.brandName')}</span>
        </Link>

        <nav className="app-shell__nav">
          <p className="app-shell__nav-title">{t('app.menu')}</p>
          <ul className="app-shell__nav-list">
            <li>
              <NavLink
                className={`app-shell__nav-item ${isHomeActive ? 'app-shell__nav-item--active' : ''}`}
                end
                onClick={handleNavClick}
                to={HOME_PATH}
              >
                <span className="app-shell__nav-item-label">{t('app.home')}</span>
              </NavLink>
            </li>
          </ul>

          <button
            className="app-shell__nav-title app-shell__nav-title--spaced app-shell__nav-title-button"
            onClick={handleLoveEasterEggClick}
            type="button"
          >
            {t('app.services')}
          </button>
          <ul className="app-shell__nav-list">
            {visibleServices.map((service) => {
              const isActive = location.pathname === service.path;
              const serviceLabel = getServiceTranslation(t, service.id, 'label');

              if (!service.isAvailable) {
                return (
                  <li key={service.id}>
                    <button
                      className="app-shell__nav-item app-shell__nav-item--disabled"
                      disabled
                      type="button"
                    >
                      <span className="app-shell__nav-item-label">{serviceLabel}</span>
                      <span className="app-shell__nav-item-badge">{t('app.soon')}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={service.id}>
                  <NavLink
                    className={`app-shell__nav-item ${isActive ? 'app-shell__nav-item--active' : ''}`}
                    onClick={handleNavClick}
                    to={service.path}
                  >
                    <span className="app-shell__nav-item-label">{serviceLabel}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="app-shell__footer">
          <LanguageSwitcher />
        </div>
      </aside>

      <main className="app-shell__content">{children}</main>
    </div>
  );
};
