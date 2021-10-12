package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.User;

@Value
public class UserInfo {

    long id;

    String name;

    String avatar;

    public UserInfo(User user) {
        id = user.getId();
        name = user.getName();
        avatar = user.getAvatar();
    }

}
