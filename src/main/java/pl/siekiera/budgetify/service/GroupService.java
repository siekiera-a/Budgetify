package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.CreateGroupRequest;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.UserEntity;

import java.util.List;

public interface GroupService {

    GroupEntity create(CreateGroupRequest data, UserEntity owner);

    List<GroupEntity> findAll(UserEntity user);

}
