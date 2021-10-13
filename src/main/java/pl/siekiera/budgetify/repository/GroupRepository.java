package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.GroupEntity;

public interface GroupRepository extends JpaRepository<GroupEntity, Long> {
}
