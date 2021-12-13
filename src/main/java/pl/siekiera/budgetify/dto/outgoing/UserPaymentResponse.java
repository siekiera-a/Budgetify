package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.model.User;

@Value
public class UserPaymentResponse {

    User user;
    double price;

}
