package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.LoginRequestBody;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.dto.outgoing.LoginResponse;
import pl.siekiera.budgetify.entity.TokenEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.exception.UserAlreadyExistsException;
import pl.siekiera.budgetify.model.Profile;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.AccountService;
import pl.siekiera.budgetify.service.AuthenticationService;
import pl.siekiera.budgetify.service.TokenService;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationServiceImpl implements AuthenticationService {

    AccountService accountService;
    TokenService tokenService;
    UserRepository userRepository;

    @Override
    public LoginResponse register(RegisterRequestBody details) throws UserAlreadyExistsException {
        UserEntity user = accountService.create(details);
        TokenEntity token = tokenService.createUniqueToken();
        user.getTokens().add(token);
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new UserAlreadyExistsException(String.format("User with email: %s already " +
                "exists!", user.getEmail()), e);
        }
        return new LoginResponse(token.getValue(), new Profile(user));
    }

    @Override
    public LoginResponse signIn(LoginRequestBody credentials) {
        Optional<UserEntity> userWrapper = accountService.findUser(credentials.getEmail(),
            credentials.getPassword());

        if (userWrapper.isEmpty()) {
            return null;
        }

        UserEntity user = userWrapper.get();
        TokenEntity token = tokenService.createUniqueToken();
        user.getTokens().add(token);
        userRepository.save(user);
        return new LoginResponse(token.getValue(), new Profile(user));
    }

    @Override
    @Transactional
    public LoginResponse revokeToken(UserEntity user, String token) {
        user = userRepository.getUserWithTokens(user);
        Set<TokenEntity> tokens = user.getTokens();
        Optional<TokenEntity> tokenToRemove = tokens.stream()
            .filter(tokenEntity -> token.equals(tokenEntity.getValue()))
            .findFirst();
        tokenToRemove.ifPresent(tokens::remove);
        TokenEntity newToken = tokenService.createUniqueToken();
        tokens.add(newToken);
        userRepository.save(user);
        return new LoginResponse(newToken.getValue(), new Profile(user));
    }

}
