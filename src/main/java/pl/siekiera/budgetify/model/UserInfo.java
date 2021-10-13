package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.UserEntity;

@Value
public class UserInfo {

    long id;

    String name;

    String avatar;

    public UserInfo(UserEntity user) {
        id = user.getId();
        name = user.getName();
        avatar = user.getAvatar();
    }

}
