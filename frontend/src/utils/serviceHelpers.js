import { CUSTOM_TEMPLATE_ID, getServiceTemplateById } from '../data/serviceTemplates';
import { getServicePeriodLabel } from './formatDate';

export const calculateLineTotal = (hours, rate) => {
  const parsedHours = Number(hours) || 0;
  const parsedRate = Number(rate) || 0;

  return parsedHours * parsedRate;
};

export const calculateInvoiceTotal = (services) => {
  return services.reduce((accumulator, service) => {
    return accumulator + calculateLineTotal(service.hours, service.rate);
  }, 0);
};

export const createServiceLineItem = (overrides = {}) => {
  return {
    customDescription: '',
    hours: '',
    id: crypto.randomUUID(),
    rate: '',
    templateId: '',
    ...overrides,
  };
};

export const getServiceDescription = (service, dueDate) => {
  if (!service.templateId) {
    return '—';
  }

  if (service.templateId === CUSTOM_TEMPLATE_ID) {
    return service.customDescription.trim() || 'Custom service';
  }

  const template = getServiceTemplateById(service.templateId);

  if (!template) {
    return 'Service';
  }

  if (template.appendPeriod) {
    const periodLabel = getServicePeriodLabel(dueDate);

    return periodLabel;
  }

  return template.label;
};
