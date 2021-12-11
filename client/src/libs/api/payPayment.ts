import { HttpClient } from "..";

export type SuccessResponse = {
  success: boolean;
};

export async function payPayment(http: HttpClient, paymentId: number) {
  return await http.post<SuccessResponse>(`/payments/pay/${paymentId}`, {});
}
