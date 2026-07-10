export const clients = [
  {
    addressLine1: '13777 Ballantyne',
    addressLine2: 'Corp Pl, Ste 210',
    cityStateZip: 'Charlotte NC 28277',
    id: 'beesbridge',
    name: 'BEESBRIDGE LLC',
  },
];

export const getClientById = (clientId) => {
  return clients.find((client) => {
    return client.id === clientId;
  });
};
