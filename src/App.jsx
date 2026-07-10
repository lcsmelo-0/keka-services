import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageProvider';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { InvoiceGeneratorPage } from './pages/InvoiceGeneratorPage';
import { QrCodeGeneratorPage } from './pages/QrCodeGeneratorPage';

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<InvoiceGeneratorPage />} path="/invoice-generator" />
            <Route element={<QrCodeGeneratorPage />} path="/qr-code-generator" />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
