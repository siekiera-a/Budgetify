import { HttpClient, InvoiceResponse } from "..";

export async function getInvoice(http: HttpClient, id: number) {
  return await http.get<InvoiceResponse>(`/invoice/${id}`);
}
