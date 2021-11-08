package pl.siekiera.budgetify.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.siekiera.budgetify.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findUserByEmail(String email);

    @Query("select u from UserEntity u where u.id <> :id and (lower(u.name) like lower(concat" +
        "(:term, '%')) or lower(u.email) like lower(concat(:term, '%')))")
    Page<UserEntity> findUsersByEmailOrName(@Param("term") String searchTerm,
                                            @Param("id") long myId,
                                            Pageable pageable);

    @Query("select u from UserEntity u join fetch u.tokens where u = :user")
    UserEntity getUserWithTokens(@Param("user") UserEntity user);

}
