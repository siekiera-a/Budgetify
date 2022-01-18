package pl.siekiera.budgetify;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import pl.siekiera.budgetify.repository.TokenRepository;
import pl.siekiera.budgetify.service.TokenService;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class BudgetifyApplicationTests {

    @Autowired TokenRepository tokenRepository;
    @Autowired TokenService tokenService;

    @TestConfiguration
    static class Config {
        @Bean
        @Primary
        public TokenRepository getTokenRepository() {
            var repository = mock(TokenRepository.class);
            when(repository.existsById(anyString())).thenReturn(false);
            return repository;
        }
    }

    @Test
    void testCreateUniqueToken_ReturnsNotExpiredToken() {
        var token = tokenService.createUniqueToken();
        assertNotNull(token, "Token can not be null!");
        assertFalse(token.getValue().isBlank(), "Token can not be blank!");
        assertTrue(token.getExpirationTime().isAfter(LocalDateTime.now()),
            "Token can not be expired");
        verify(tokenRepository, times(1)).existsById(anyString());
    }

    @Test
    void contextLoads() {
    }
}
