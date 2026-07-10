import { Navigate } from 'react-router-dom';
import { useInvoiceUnlock } from '../context/InvoiceUnlockProvider';
import { InvoiceGeneratorPage } from './InvoiceGeneratorPage';

export const InvoiceGeneratorRoute = () => {
  const { isInvoiceUnlocked } = useInvoiceUnlock();

  if (!isInvoiceUnlocked) {
    return <Navigate replace to="/" />;
  }

  return <InvoiceGeneratorPage />;
};
