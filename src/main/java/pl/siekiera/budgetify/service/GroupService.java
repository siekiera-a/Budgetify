package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.CreateGroupRequest;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.UserEntity;

public interface GroupService {

    GroupEntity create(CreateGroupRequest data, UserEntity owner);

}
