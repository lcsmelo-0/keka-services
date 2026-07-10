import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShellLayout } from './components/AppShellLayout';
import { InvoiceUnlockProvider } from './context/InvoiceUnlockProvider';
import { LanguageProvider } from './i18n/LanguageProvider';
import { LOVE_EASTER_EGG_PATH } from './data/navigation';
import { HomePage } from './pages/HomePage';
import { InvoiceGeneratorRoute } from './pages/InvoiceGeneratorRoute';
import { LovePage } from './pages/LovePage';
import { QrCodeGeneratorPage } from './pages/QrCodeGeneratorPage';

const App = () => {
  return (
    <LanguageProvider>
      <InvoiceUnlockProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<LovePage />} path={LOVE_EASTER_EGG_PATH} />
            <Route element={<AppShellLayout />}>
              <Route element={<HomePage />} index />
              <Route element={<InvoiceGeneratorRoute />} path="invoice-generator" />
              <Route element={<QrCodeGeneratorPage />} path="qr-code-generator" />
            </Route>
          </Routes>
        </BrowserRouter>
      </InvoiceUnlockProvider>
    </LanguageProvider>
  );
};

export default App;
