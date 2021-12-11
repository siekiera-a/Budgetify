import { HttpClient, SuccessResponse } from "..";

export async function acceptPayment(http: HttpClient, paymentId: number) {
  return await http.post<SuccessResponse>(`/payments/accept/${paymentId}`, {});
}
