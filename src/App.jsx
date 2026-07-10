import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { InvoiceUnlockProvider } from './context/InvoiceUnlockProvider';
import { LanguageProvider } from './i18n/LanguageProvider';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { InvoiceGeneratorRoute } from './pages/InvoiceGeneratorRoute';
import { QrCodeGeneratorPage } from './pages/QrCodeGeneratorPage';

const App = () => {
  return (
    <LanguageProvider>
      <InvoiceUnlockProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<InvoiceGeneratorRoute />} path="/invoice-generator" />
              <Route element={<QrCodeGeneratorPage />} path="/qr-code-generator" />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </InvoiceUnlockProvider>
    </LanguageProvider>
  );
};

export default App;
