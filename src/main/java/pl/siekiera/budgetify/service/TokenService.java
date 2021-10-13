package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.entity.TokenEntity;

import java.util.Optional;

public interface TokenService {

    TokenEntity createUniqueToken();

    Optional<TokenEntity> findToken(String value);

}
