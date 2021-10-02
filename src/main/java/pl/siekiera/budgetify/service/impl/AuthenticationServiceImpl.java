package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.LoginRequestBody;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.dto.outgoing.LoginResponse;
import pl.siekiera.budgetify.entity.Token;
import pl.siekiera.budgetify.entity.User;
import pl.siekiera.budgetify.exception.UserAlreadyExistsException;
import pl.siekiera.budgetify.model.ProfileInfo;
import pl.siekiera.budgetify.repository.TokenRepository;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.AccountService;
import pl.siekiera.budgetify.service.AuthenticationService;
import pl.siekiera.budgetify.service.AuthorizationService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationServiceImpl implements AuthenticationService {

    AccountService accountService;
    AuthorizationService authorizationService;
    TokenRepository tokenRepository;
    UserRepository userRepository;

    @Override
    public LoginResponse register(RegisterRequestBody details) throws UserAlreadyExistsException {
        User user = accountService.create(details);
        Token token = createToken();
        user.getTokens().add(token);
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new UserAlreadyExistsException(String.format("User with email: %s already " +
                "exists!", user.getEmail()), e);
        }
        return new LoginResponse(token.getValue(), new ProfileInfo(user));
    }

    @Override
    public LoginResponse signIn(LoginRequestBody credentials) {
        Optional<User> userWrapper = accountService.findUser(credentials.getEmail(),
            credentials.getPassword());

        if (userWrapper.isEmpty()) {
            return null;
        }

        User user = userWrapper.get();
        Token token = createToken();
        user.getTokens().add(token);
        userRepository.save(user);
        return new LoginResponse(token.getValue(), new ProfileInfo(user));
    }

    private Token createToken() {
        Token token = null;
        do {
            Token userToken = authorizationService.createToken();

            try {
                tokenRepository.save(userToken);
                token = userToken;
            } catch (Exception e) {
            }
        } while (token == null);
        return token;
    }
}
