export const HOME_PATH = '/';

export const LOVE_EASTER_EGG_PATH = '/keka';

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
  {
    id: 'todo-board',
    isAvailable: true,
    path: '/todo-board',
  },
  {
    id: 'links-board',
    isAvailable: true,
    path: '/links-board',
  },
];

export const getPlatformServiceById = (serviceId) => {
  return platformServices.find((service) => {
    return service.id === serviceId;
  });
};

export const getVisiblePlatformServices = () => {
  return platformServices.filter((service) => {
    return service.isAvailable;
  });
};
