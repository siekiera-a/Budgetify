package pl.siekiera.budgetify.dto.outgoing;

import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@ToString
@EqualsAndHashCode
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class GroupResponse {

    long id;
    String name;
    String avatar;
    LocalDateTime creationTime;
    User owner;
    List<User> members;

    public GroupResponse(GroupEntity group) {
        id = group.getId();
        name = group.getName();
        avatar = group.getAvatar();
        creationTime = group.getCreationTime();
        owner = new User(group.getOwner());
        members = group.getUsers().stream()
            .map(user -> new User(user.getUser()))
            .collect(Collectors.toUnmodifiableList());
    }

}
