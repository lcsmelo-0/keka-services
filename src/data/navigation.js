export const HOME_PATH = '/';

export const platformServices = [
  {
    id: 'invoice-generator',
    isAvailable: true,
    isHidden: true,
    path: '/invoice-generator',
  },
  {
    id: 'qr-code-generator',
    isAvailable: true,
    path: '/qr-code-generator',
  },
];

export const getPlatformServiceById = (serviceId) => {
  return platformServices.find((service) => {
    return service.id === serviceId;
  });
};

export const getVisiblePlatformServices = (isInvoiceUnlocked) => {
  return platformServices.filter((service) => {
    if (service.isHidden && !isInvoiceUnlocked) {
      return false;
    }

    return service.isAvailable;
  });
};
