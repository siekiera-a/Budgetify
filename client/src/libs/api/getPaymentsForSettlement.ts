import { HttpClient } from "..";
import { PaymentResponse } from ".";

export function getPaymentsForSettlement(http: HttpClient) {
  return http.get<PaymentResponse[]>("/payments/forSettlement");
}
