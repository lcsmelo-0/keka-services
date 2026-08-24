export const CUSTOM_TEMPLATE_ID = 'custom';

export const serviceTemplates = [
  {
    appendPeriod: true,
    id: 'software-development',
    label: 'Software development services',
  },
  {
    appendPeriod: false,
    id: 'custom-software',
    label: 'Custom computer software development',
  },
  {
    appendPeriod: false,
    id: 'it-consulting',
    label: 'IT consulting',
  },
  {
    appendPeriod: false,
    id: CUSTOM_TEMPLATE_ID,
    label: 'Other (type below)',
  },
];

export const getServiceTemplateById = (templateId) => {
  return serviceTemplates.find((template) => {
    return template.id === templateId;
  });
};
