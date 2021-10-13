package pl.siekiera.budgetify.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.siekiera.budgetify.entity.TokenEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.service.TokenService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenFilter extends OncePerRequestFilter {

    @Value("${security.token.header:Authorization}")
    String tokenHeader;

    final TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = request.getHeader(tokenHeader);
        Optional<TokenEntity> tokenWrapper = tokenService.findToken(token);
        tokenWrapper.ifPresentOrElse(t -> {
            LocalDateTime now = LocalDateTime.now();

            if (now.isAfter(t.getExpirationTime())) {
                SecurityContextHolder.clearContext();
                return;
            }

            UserEntity user = t.getUser();
            SecurityContextHolder.getContext().setAuthentication(getAuthentication(user));
        }, SecurityContextHolder::clearContext);

        filterChain.doFilter(request, response);
    }

    private Authentication getAuthentication(UserEntity user) {
        return new UsernamePasswordAuthenticationToken(user, "", Collections.emptyList());
    }
}
