package pl.siekiera.budgetify.service;

import org.springframework.data.domain.Page;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.entity.User;

import java.util.Optional;

public interface AccountService {

    User create(RegisterRequestBody details);

    void changeBlikNumber(User user, String number);

    void changeBankAccount(User user, String bankAccount);

    Optional<User> findUser(String email, String password);

    Page<User> findUsers(String searchTerm, int page, User me);

}
