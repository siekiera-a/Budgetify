package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Value
public class GroupResponse {

    String name;
    String avatar;
    LocalDateTime creationTime;
    User owner;
    List<User> members;

    public GroupResponse(GroupEntity group) {
        name = group.getName();
        avatar = group.getAvatar();
        creationTime = group.getCreationTime();
        owner = new User(group.getOwner());
        members = group.getUsers().stream()
            .map(user -> new User(user.getUser()))
            .collect(Collectors.toUnmodifiableList());
    }

}
