package pl.siekiera.budgetify.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.siekiera.budgetify.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(String email);

    @Query("select u from User u where u.id <> :id and (u.name like concat(:term, '%') or u.email" +
        " like concat(:term, '%'))")
    Page<User> findUsersByEmailOrName(@Param("term") String searchTerm, @Param("id") long myId,
                                      Pageable pageable);

}
