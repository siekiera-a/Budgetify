import { GroupBase, PaymentStatus, User } from ".";
import { HttpClient } from "..";

export type UserWithConfidential = User & {
  bankAccount: string | null;
  blikNumber: string | null;
};

export type Invoice = {
  id: number;
  issuer: UserWithConfidential;
  group: GroupBase;
  name: string;
  creationTime: string;
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
