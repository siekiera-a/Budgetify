package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.User;

import java.time.LocalDateTime;

@Value
public class ProfileInfo {

    long id;

    String name;

    String email;

    LocalDateTime registrationTime;

    String blikNumber;

    String bankAccount;

    String avatar;

    public ProfileInfo(User user) {
        id = user.getId();
        name = user.getName();
        email = user.getEmail();
        registrationTime = user.getRegistrationTime();
        blikNumber = user.getBlikNumber();
        bankAccount = user.getBankAccount();
        avatar = user.getAvatar();
    }

}
