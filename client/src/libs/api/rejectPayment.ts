import { HttpClient, SuccessResponse } from "..";

export async function rejectPayment(http: HttpClient, paymentId: number) {
  return await http.post<SuccessResponse>(`/payments/reject/${paymentId}`, {});
}
