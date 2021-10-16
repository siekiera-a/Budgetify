package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.UserEntity;

public interface GroupRepository extends JpaRepository<GroupEntity, Long> {

    @Query("select case when (count(g.id) > 0) then true else false end from GroupEntity g left " +
        "join GroupMemberEntity ge on ge.group = g where g = :group and ge.user = :user")
    boolean isMember(@Param("group") GroupEntity group, @Param("user") UserEntity user);

}
