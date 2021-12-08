package pl.siekiera.budgetify.service;

import org.springframework.data.domain.Page;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.entity.UserEntity;

import java.util.Optional;

public interface AccountService {

    UserEntity create(RegisterRequestBody details);

    void changeBlikNumber(UserEntity user, String number);

    void changeBankAccount(UserEntity user, String bankAccount);

    Optional<UserEntity> findUser(String email, String password);

    Page<UserEntity> findUsers(String searchTerm, int page, UserEntity me);

}
