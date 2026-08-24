import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShellLayout } from './components/AppShellLayout';
import { LOVE_EASTER_EGG_PATH } from './data/navigation';
import { LanguageProvider } from './i18n/LanguageProvider';
import { HomePage } from './pages/HomePage';
import { InvoiceGeneratorPage } from './pages/InvoiceGeneratorPage';
import { LinksBoardPage } from './pages/LinksBoardPage';
import { LovePage } from './pages/LovePage';
import { QrCodeGeneratorPage } from './pages/QrCodeGeneratorPage';
import { TodoBoardPage } from './pages/TodoBoardPage';

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LovePage />} path={LOVE_EASTER_EGG_PATH} />
          <Route element={<AppShellLayout />}>
            <Route element={<HomePage />} index />
            <Route element={<InvoiceGeneratorPage />} path="invoice-generator" />
            <Route element={<QrCodeGeneratorPage />} path="qr-code-generator" />
            <Route element={<TodoBoardPage />} path="todo-board" />
            <Route element={<LinksBoardPage />} path="links-board" />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
