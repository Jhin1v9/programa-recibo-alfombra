export type ServiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type ClientData = {
  name: string;
  phone: string;
  address: string;
};

export type ReceiptData = {
  receiptNumber: string;
  issueDate: string;
  client: ClientData;
  services: ServiceItem[];
  observations: string;
  discount: number;
};
