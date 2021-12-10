package pl.siekiera.budgetify.model;

import lombok.EqualsAndHashCode;
import lombok.Value;
import pl.siekiera.budgetify.entity.UserEntity;

@Value
@EqualsAndHashCode(callSuper = true)
public class UserWithConfidential extends User {

    String blikNumber;
    String bankAccount;

    public UserWithConfidential(UserEntity user) {
        super(user);
        blikNumber = user.getBlikNumber();
        bankAccount = user.getBankAccount();
    }
}
