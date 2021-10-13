package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.CreateGroupRequest;
import pl.siekiera.budgetify.entity.Group;
import pl.siekiera.budgetify.entity.GroupMember;
import pl.siekiera.budgetify.entity.User;
import pl.siekiera.budgetify.repository.GroupRepository;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.GroupService;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class GroupServiceImpl implements GroupService {

    GroupRepository groupRepository;
    UserRepository userRepository;

    @Override
    public Group create(CreateGroupRequest data, User owner) {
        Group group = new Group();

        Set<Long> membersIds = new HashSet<>(data.getMembers());
        membersIds.add(owner.getId());

        Set<GroupMember> members = userRepository.findAllById(membersIds).stream()
            .map(user -> {
                GroupMember member = new GroupMember();
                member.setGroup(group);
                member.setUser(user);
                member.setNick(user.getName());
                return member;
            }).collect(Collectors.toUnmodifiableSet());

        group.setUsers(members);
        group.setName(data.getName());
        group.setOwner(owner);
        group.setAvatar(data.getAvatar());

        groupRepository.save(group);
        return group;
    }
}
