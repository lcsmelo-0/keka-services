import { getServiceTemplateTranslation } from '../i18n/getTranslation';
import { useTranslation } from '../i18n/LanguageProvider';
import { CUSTOM_TEMPLATE_ID, serviceTemplates } from '../data/serviceTemplates';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateLineTotal } from '../utils/serviceHelpers';

export const ServiceLineItem = ({
  canRemove,
  onChange,
  onRemove,
  service,
}) => {
  const { t } = useTranslation();
  const isCustomTemplate = service.templateId === CUSTOM_TEMPLATE_ID;
  const lineTotal = calculateLineTotal(service.hours, service.rate);

  return (
    <div className="service-line-item">
      <div className="service-line-item__header">
        <span className="service-line-item__title">{t('serviceLineItem.service')}</span>
        {canRemove && (
          <button
            className="service-line-item__remove"
            onClick={() => {
              onRemove(service.id);
            }}
            type="button"
          >
            {t('serviceLineItem.remove')}
          </button>
        )}
      </div>

      <div className="invoice-form__field">
        <label className="invoice-form__label" htmlFor={`description-${service.id}`}>
          {t('serviceLineItem.description')}
        </label>
        <select
          className="invoice-form__input"
          id={`description-${service.id}`}
          onChange={(event) => {
            onChange(service.id, 'templateId', event.target.value);
          }}
          value={service.templateId}
        >
          <option value="">{t('serviceLineItem.selectDescription')}</option>
          {serviceTemplates.map((template) => {
            return (
              <option key={template.id} value={template.id}>
                {getServiceTemplateTranslation(t, template.id)}
              </option>
            );
          })}
        </select>
      </div>

      {isCustomTemplate && (
        <div className="invoice-form__field">
          <label className="invoice-form__label" htmlFor={`custom-${service.id}`}>
            {t('serviceLineItem.customDescription')}
          </label>
          <input
            className="invoice-form__input"
            id={`custom-${service.id}`}
            onChange={(event) => {
              onChange(service.id, 'customDescription', event.target.value);
            }}
            placeholder={t('serviceLineItem.customDescriptionPlaceholder')}
            type="text"
            value={service.customDescription}
          />
        </div>
      )}

      <div className="service-line-item__row">
        <div className="invoice-form__field">
          <label className="invoice-form__label" htmlFor={`hours-${service.id}`}>
            {t('serviceLineItem.hours')}
          </label>
          <input
            className="invoice-form__input"
            id={`hours-${service.id}`}
            min="0"
            onChange={(event) => {
              onChange(service.id, 'hours', event.target.value);
            }}
            step="1"
            type="number"
            value={service.hours}
          />
        </div>

        <div className="invoice-form__field">
          <label className="invoice-form__label" htmlFor={`rate-${service.id}`}>
            {t('serviceLineItem.rate')}
          </label>
          <input
            className="invoice-form__input"
            id={`rate-${service.id}`}
            min="0"
            onChange={(event) => {
              onChange(service.id, 'rate', event.target.value);
            }}
            step="0.01"
            type="number"
            value={service.rate}
          />
        </div>
      </div>

      <div className="service-line-item__line-total">
        <span className="service-line-item__line-total-label">
          {t('serviceLineItem.lineTotal')}
        </span>
        <span className="service-line-item__line-total-value">
          {formatCurrency(lineTotal)}
        </span>
      </div>
    </div>
  );
};
