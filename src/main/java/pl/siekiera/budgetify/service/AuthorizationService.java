package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.entity.Token;

public interface AuthorizationService {

    Token createToken();

}
