package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(String email);

}
