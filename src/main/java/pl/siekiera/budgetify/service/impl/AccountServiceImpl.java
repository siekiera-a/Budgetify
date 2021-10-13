package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.AccountService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountServiceImpl implements AccountService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public UserEntity create(RegisterRequestBody details) {
        String encodedPassword = passwordEncoder.encode(details.getPassword());
        return new UserEntity(details.getEmail(), encodedPassword, details.getName());
    }

    @Override
    public void changeBlikNumber(UserEntity user, String number) {
        user.setBlikNumber(number);
        userRepository.save(user);
    }

    @Override
    public void changeBankAccount(UserEntity user, String bankAccount) {
        user.setBankAccount(bankAccount);
        userRepository.save(user);
    }

    @Override
    public Optional<UserEntity> findUser(String email, String password) {
        Optional<UserEntity> userWrapper = userRepository.findUserByEmail(email);
        if (userWrapper.isEmpty()) {
            return userWrapper;
        }
        UserEntity user = userWrapper.get();
        boolean passwordsMatches = passwordEncoder.matches(password, user.getPassword());
        return passwordsMatches ? Optional.of(user) : Optional.empty();
    }

    @Override
    public Page<UserEntity> findUsers(String searchTerm, int page, UserEntity me) {
        Pageable pageable = PageRequest.of(page, 15);
        return userRepository.findUsersByEmailOrName(searchTerm, me.getId(), pageable);
    }

}
