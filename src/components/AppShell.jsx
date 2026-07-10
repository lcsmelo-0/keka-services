import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useInvoiceUnlock } from '../context/InvoiceUnlockProvider';
import { getServiceTranslation } from '../i18n/getTranslation';
import { useTranslation } from '../i18n/LanguageProvider';
import { getVisiblePlatformServices, HOME_PATH } from '../data/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import './AppShell.css';

export const AppShell = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { handleEasterEggClick, isInvoiceUnlocked } = useInvoiceUnlock();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const visibleServices = getVisiblePlatformServices(isInvoiceUnlocked);

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
          <button
            className="app-shell__brand-tagline"
            onClick={handleEasterEggClick}
            type="button"
          >
            {t('app.brandTagline')}
          </button>
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
        <button
          className="app-shell__sidebar-brand"
          onClick={handleEasterEggClick}
          type="button"
        >
          <span className="app-shell__sidebar-brand-name">{t('app.brandName')}</span>
        </button>

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

          <p className="app-shell__nav-title app-shell__nav-title--spaced">{t('app.services')}</p>
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

        <LanguageSwitcher />
      </aside>

      <main className="app-shell__content">{children}</main>
    </div>
  );
};
