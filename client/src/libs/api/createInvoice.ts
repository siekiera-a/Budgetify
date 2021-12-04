import { HttpClient, User, GroupBase } from "..";

export type InvoiceItemBase = {
  text: string;
  price: number;
};

export type InvoiceItemRequest = InvoiceItemBase & {
  assignedUsers: number[];
};

export type InvoceItem = InvoiceItemBase & {
  id: number;
};

export type InvoiceRequest = {
  groupId: number;
  images: string[];
  name?: string;
  items: InvoiceItemRequest[];
};

export type InvoiceResponse = {
  id: number;
  issuer: User;
  group: GroupBase;
  creationTime: string;
  items: InvoceItem[];
  images: string[];
  name: string | null;
};

export async function createInvoice(http: HttpClient, data: InvoiceRequest) {
  return await http.post<InvoiceResponse>("/invoice", data);
}
