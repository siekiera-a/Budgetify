import { GroupResponse } from ".";
import { HttpClient } from "..";

export type GroupInvoiceBase = {
  id: number;
  name: string | null;
  creationTime: string;
  totalPrice: number;
};

export type PaymentStatus = "OPENED" | "CLOSED" | "PENDING" | "REJECTED";

export type InvoiceToPay = GroupInvoiceBase & {
  status: PaymentStatus | null;
};

export type InvoiceToSettlement = GroupInvoiceBase & {
  paid: number;
  inSettlement: number;
  waitForPayment: number;
};

export type GroupDetailsResponse = GroupResponse & {
  toPay: number;
  toReturn: number;
  invoices: Array<InvoiceToPay | InvoiceToSettlement>;
};

export async function getGroupDetails(http: HttpClient, id: number) {
  return await http.get<GroupDetailsResponse>(`/group/${id}`);
}
