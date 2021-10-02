package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.entity.Token;
import pl.siekiera.budgetify.repository.TokenRepository;
import pl.siekiera.budgetify.service.TokenService;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenServiceImpl implements TokenService {

    @Value("${security.token.expire-length:336}")
    long tokenValidityInHours;

    @Value("${security.token.length:128}")
    long tokenLength;

    final Random random = new SecureRandom();

    final TokenRepository tokenRepository;

    private Token createToken() {
        String token = createRandomString();
        LocalDateTime expiration = LocalDateTime.now().plus(tokenValidityInHours,
            ChronoUnit.HOURS);
        return new Token(token, expiration);
    }

    private String createRandomString() {
        return random.ints('0', 'Z')
            .filter(x -> (x >= '0' && x <= '9') || (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z'))
            .limit(tokenLength)
            .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
            .toString();
    }

    @Override
    public Token createUniqueToken() {
        Token token = null;
        do {
            Token userToken = createToken();

            try {
                tokenRepository.save(userToken);
                token = userToken;
            } catch (Exception e) {
            }
        } while (token == null);
        return token;
    }
}
