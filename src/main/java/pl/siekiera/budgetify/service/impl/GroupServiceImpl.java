package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.CreateGroupRequest;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.GroupMemberEntity;
import pl.siekiera.budgetify.entity.UserEntity;
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
    public GroupEntity create(CreateGroupRequest data, UserEntity owner) {
        GroupEntity group = new GroupEntity();

        Set<Long> membersIds = new HashSet<>(data.getMembers());
        membersIds.add(owner.getId());

        Set<GroupMemberEntity> members = userRepository.findAllById(membersIds).stream()
            .map(user -> {
                GroupMemberEntity member = new GroupMemberEntity();
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
