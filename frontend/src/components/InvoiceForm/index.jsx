import { useTranslation } from '../../i18n/LanguageProvider';
import { clients } from '../../data/clients';
import { ServiceLineItem } from '../ServiceLineItem';
import { formatCurrency } from '../../utils/formatCurrency';

export const InvoiceForm = ({
  clientId,
  dueDate,
  invoiceDate,
  invoiceNumber,
  isGenerating,
  onAddService,
  onClientChange,
  onDueDateChange,
  onDownload,
  onInvoiceDateChange,
  onInvoiceNumberChange,
  onRemoveService,
  onServiceChange,
  previousInvoiceNumber,
  services,
  total,
}) => {
  const { t } = useTranslation();

  return (
    <section className="invoice-form">
      <div className="invoice-form__field">
        <label className="invoice-form__label" htmlFor="client">
          {t('invoiceForm.client')}
        </label>
        <select
          className="invoice-form__input"
          id="client"
          onChange={(event) => {
            onClientChange(event.target.value);
          }}
          value={clientId}
        >
          <option value="">{t('invoiceForm.selectClient')}</option>
          {clients.map((client) => {
            return (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="invoice-form__field">
        <label className="invoice-form__label" htmlFor="invoice-number">
          {t('invoiceForm.invoiceNumber')}
        </label>
        <input
          className="invoice-form__input"
          id="invoice-number"
          min="1"
          onChange={(event) => {
            onInvoiceNumberChange(event.target.value);
          }}
          type="number"
          value={invoiceNumber}
        />
        {previousInvoiceNumber && (
          <span className="invoice-form__hint">
            {t('invoiceForm.previousInvoiceNumber', { number: previousInvoiceNumber })}
          </span>
        )}
      </div>

      <div className="invoice-form__field">
        <label className="invoice-form__label" htmlFor="invoice-date">
          {t('invoiceForm.invoiceDate')}
          <span className="invoice-form__label-hint"> {t('invoiceForm.optional')}</span>
        </label>
        <input
          className="invoice-form__input"
          id="invoice-date"
          onChange={(event) => {
            onInvoiceDateChange(event.target.value);
          }}
          type="date"
          value={invoiceDate}
        />
        {!invoiceDate && (
          <span className="invoice-form__hint">{t('invoiceForm.usesTodayHint')}</span>
        )}
      </div>

      <div className="invoice-form__field">
        <label className="invoice-form__label" htmlFor="due-date">
          {t('invoiceForm.dueDate')}
        </label>
        <input
          className="invoice-form__input"
          id="due-date"
          onChange={(event) => {
            onDueDateChange(event.target.value);
          }}
          type="date"
          value={dueDate}
        />
      </div>

      <div className="invoice-form__services">
        <div className="invoice-form__services-header">
          <span className="invoice-form__services-title">{t('invoiceForm.services')}</span>
          <button
            className="invoice-form__add-service"
            onClick={onAddService}
            type="button"
          >
            {t('invoiceForm.addService')}
          </button>
        </div>

        {services.length === 0 && (
          <p className="invoice-form__empty-services">{t('invoiceForm.noServices')}</p>
        )}

        {services.map((service) => {
          return (
            <ServiceLineItem
              canRemove={services.length > 1}
              key={service.id}
              onChange={onServiceChange}
              onRemove={onRemoveService}
              service={service}
            />
          );
        })}
      </div>

      <div className="invoice-form__total">
        <span className="invoice-form__total-label">{t('invoiceForm.total')}</span>
        <span className="invoice-form__total-value">{formatCurrency(total)}</span>
      </div>

      <button
        className="invoice-form__button"
        disabled={isGenerating}
        onClick={onDownload}
        type="button"
      >
        {isGenerating ? t('invoiceForm.generatingPdf') : t('invoiceForm.downloadPdf')}
      </button>
    </section>
  );
};
