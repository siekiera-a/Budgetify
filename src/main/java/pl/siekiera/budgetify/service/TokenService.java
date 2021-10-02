package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.entity.Token;

import java.util.Optional;

public interface TokenService {

    Token createUniqueToken();

    Optional<Token> findToken(String value);

}
