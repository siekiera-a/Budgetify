package pl.siekiera.budgetify.dto.outgoing;

import lombok.Builder;
import lombok.Value;
import pl.siekiera.budgetify.entity.Group;
import pl.siekiera.budgetify.model.UserInfo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Value
public class GroupResponse {

    String name;
    String avatar;
    LocalDateTime creationTime;
    UserInfo owner;
    List<UserInfo> members;

    public GroupResponse(Group group) {
        name = group.getName();
        avatar = group.getAvatar();
        creationTime = group.getCreationTime();
        owner = new UserInfo(group.getOwner());
        members = group.getUsers().stream()
            .map(user -> new UserInfo(user.getUser()))
            .collect(Collectors.toUnmodifiableList());
    }

}
