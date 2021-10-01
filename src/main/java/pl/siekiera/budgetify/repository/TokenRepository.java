package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.Token;

public interface TokenRepository extends JpaRepository<Token, String> {
}
