package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.CreateGroupRequest;
import pl.siekiera.budgetify.entity.Group;
import pl.siekiera.budgetify.entity.User;

public interface GroupService {

    Group create(CreateGroupRequest data, User owner);

}
