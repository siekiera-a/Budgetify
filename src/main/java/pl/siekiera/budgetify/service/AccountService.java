package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.entity.User;

public interface AccountService {

    User create(RegisterRequestBody details);

    void changeBlikNumber(User user, String number);

    void changeBankAccount(User user, String bankAccount);

}
