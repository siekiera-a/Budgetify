import { GroupBase, PaymentStatus, User } from ".";
import { HttpClient } from "..";

export type Invoice = {
  id: number;
  issuer: User;
  group: GroupBase;
};

export type PaymentResponse = {
  id: number;
  price: number;
  status: PaymentStatus;
  invoice: Invoice;
};

export function getReceivables(http: HttpClient, status: PaymentStatus) {
  return http.get<PaymentResponse[]>("/payments", { status });
}
