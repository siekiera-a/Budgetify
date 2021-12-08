package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.TokenEntity;

public interface TokenRepository extends JpaRepository<TokenEntity, String> {
}
