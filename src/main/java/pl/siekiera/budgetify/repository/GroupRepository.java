package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
}
