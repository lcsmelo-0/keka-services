import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useTripleClick } from '../hooks/useTripleClick';

const InvoiceUnlockContext = createContext(null);

export const InvoiceUnlockProvider = ({ children }) => {
  const [isInvoiceUnlocked, setIsInvoiceUnlocked] = useState(false);

  const unlockInvoice = useCallback(() => {
    setIsInvoiceUnlocked(true);
  }, []);

  const handleEasterEggClick = useTripleClick(unlockInvoice);

  const value = useMemo(() => {
    return {
      handleEasterEggClick,
      isInvoiceUnlocked,
    };
  }, [handleEasterEggClick, isInvoiceUnlocked]);

  return (
    <InvoiceUnlockContext.Provider value={value}>
      {children}
    </InvoiceUnlockContext.Provider>
  );
};

export const useInvoiceUnlock = () => {
  const context = useContext(InvoiceUnlockContext);

  if (!context) {
    throw new Error('useInvoiceUnlock must be used within InvoiceUnlockProvider');
  }

  return context;
};
