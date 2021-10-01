package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
