export const formatDate = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const date = new Date(`${dateValue}T12:00:00`);

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getServicePeriodLabel = (dueDateValue) => {
  if (!dueDateValue) {
    return 'Software development services';
  }

  const dueDate = new Date(`${dueDateValue}T12:00:00`);
  const serviceDate = new Date(dueDate);
  serviceDate.setMonth(serviceDate.getMonth() - 1);

  const monthYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(serviceDate);

  return `Software development services - ${monthYear}`;
};

export const getResolvedInvoiceDate = (invoiceDateValue) => {
  if (invoiceDateValue) {
    return invoiceDateValue;
  }

  return getTodayInputValue();
};

export const getTodayInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDefaultDueDateValue = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const year = dueDate.getFullYear();
  const month = String(dueDate.getMonth() + 1).padStart(2, '0');
  const day = String(dueDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
