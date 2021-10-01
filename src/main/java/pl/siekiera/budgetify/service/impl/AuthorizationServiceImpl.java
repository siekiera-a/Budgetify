package pl.siekiera.budgetify.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.entity.Token;
import pl.siekiera.budgetify.service.AuthorizationService;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthorizationServiceImpl implements AuthorizationService {

    @Value("${security.token.expire-length:336}")
    long tokenValidityInDays;

    @Value("${security.token.length:128}")
    long tokenLength;

    Random random = new SecureRandom();

    @Override
    public Token createToken() {
        String token = createRandomString();
        LocalDateTime expiration = LocalDateTime.now().plus(tokenValidityInDays,
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

}
