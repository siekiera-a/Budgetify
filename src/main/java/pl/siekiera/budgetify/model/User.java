package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.UserEntity;

@Value
public class User {

    long id;

    String name;

    String avatar;

    public User(UserEntity user) {
        id = user.getId();
        name = user.getName();
        avatar = user.getAvatar();
    }

}
