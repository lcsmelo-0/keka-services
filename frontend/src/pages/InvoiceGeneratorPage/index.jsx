import { useRef, useState } from 'react';
import { InvoiceForm } from '../../components/InvoiceForm';
import { InvoicePreview } from '../../components/InvoicePreview';
import { getClientById } from '../../data/clients';
import { company } from '../../data/company';
import { useTranslation } from '../../i18n/LanguageProvider';
import { getResolvedInvoiceDate } from '../../utils/formatDate';
import { generatePdf } from '../../utils/generatePdf';
import {
  getInvoiceNumberFromCookie,
  saveInvoiceNumberToCookie,
} from '../../utils/invoiceNumberCookie';
import {
  calculateInvoiceTotal,
  createServiceLineItem,
} from '../../utils/serviceHelpers';
import './InvoiceGeneratorPage.css';

export const InvoiceGeneratorPage = () => {
  const { t } = useTranslation();
  const previewRef = useRef(null);
  const [clientId, setClientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previousInvoiceNumber, setPreviousInvoiceNumber] = useState(() => {
    return getInvoiceNumberFromCookie();
  });
  const [services, setServices] = useState([]);

  const resolvedInvoiceDate = getResolvedInvoiceDate(invoiceDate);
  const client = getClientById(clientId);
  const total = calculateInvoiceTotal(services);

  const handleAddService = () => {
    setServices((currentServices) => {
      return [...currentServices, createServiceLineItem()];
    });
  };

  const handleRemoveService = (serviceId) => {
    setServices((currentServices) => {
      return currentServices.filter((service) => {
        return service.id !== serviceId;
      });
    });
  };

  const handleServiceChange = (serviceId, field, value) => {
    setServices((currentServices) => {
      return currentServices.map((service) => {
        if (service.id !== serviceId) {
          return service;
        }

        return {
          ...service,
          [field]: value,
        };
      });
    });
  };

  const handleDownload = async () => {
    if (!previewRef.current || isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const clientSlug = client?.name.replace(/\s+/g, '-').toLowerCase() ?? 'draft';

      await generatePdf(
        previewRef.current,
        `invoice-${invoiceNumber || 'draft'}-${clientSlug}.pdf`,
      );

      if (invoiceNumber) {
        saveInvoiceNumberToCookie(invoiceNumber);
        setPreviousInvoiceNumber(invoiceNumber);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="invoice-generator-page">
      <header className="invoice-generator-page__header">
        <h1 className="invoice-generator-page__title">{t('invoiceGenerator.title')}</h1>
        <p className="invoice-generator-page__description">
          {t('invoiceGenerator.description')}
        </p>
      </header>

      <div className="invoice-generator-page__layout">
        <InvoiceForm
          clientId={clientId}
          dueDate={dueDate}
          invoiceDate={invoiceDate}
          invoiceNumber={invoiceNumber}
          isGenerating={isGenerating}
          onAddService={handleAddService}
          onClientChange={setClientId}
          onDueDateChange={setDueDate}
          onDownload={handleDownload}
          onInvoiceDateChange={setInvoiceDate}
          onInvoiceNumberChange={setInvoiceNumber}
          onRemoveService={handleRemoveService}
          onServiceChange={handleServiceChange}
          previousInvoiceNumber={previousInvoiceNumber}
          services={services}
          total={total}
        />

        <div className="invoice-generator-page__preview">
          <InvoicePreview
            client={client}
            company={company}
            dueDate={dueDate}
            invoiceDate={resolvedInvoiceDate}
            invoiceNumber={invoiceNumber}
            previewRef={previewRef}
            services={services}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};
