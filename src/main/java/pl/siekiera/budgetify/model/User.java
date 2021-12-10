package pl.siekiera.budgetify.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
import pl.siekiera.budgetify.entity.UserEntity;

@Getter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
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
