package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.LoginRequestBody;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.dto.outgoing.LoginResponse;
import pl.siekiera.budgetify.exception.UserAlreadyExistsException;

public interface AuthenticationService {

    LoginResponse register(RegisterRequestBody details) throws UserAlreadyExistsException;

    LoginResponse signIn(LoginRequestBody credentials);

}
