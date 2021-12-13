import {User} from ".";
import {HttpClient} from "..";

export type UserPayment = {
  user: User;
  price: number;
};

export function getPaymentsToReturn(http: HttpClient) {
  return http.get<UserPayment[]>("/payments/toReturn");
}
