package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.GroupEntity;

import java.time.LocalDateTime;

@Value
public class Group {

    long id;
    String name;
    String avatar;
    LocalDateTime creationTime;

    public Group(GroupEntity group) {
        id = group.getId();
        name = group.getName();
        avatar = group.getAvatar();
        creationTime = group.getCreationTime();
    }

}
