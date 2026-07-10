export const HOME_PATH = '/';

export const platformServices = [
  {
    id: 'invoice-generator',
    isAvailable: true,
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
