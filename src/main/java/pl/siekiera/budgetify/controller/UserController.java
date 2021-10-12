package pl.siekiera.budgetify.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.siekiera.budgetify.dto.incoming.LoginRequestBody;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.dto.outgoing.LoginResponse;
import pl.siekiera.budgetify.dto.outgoing.SearchUsersResponse;
import pl.siekiera.budgetify.entity.User;
import pl.siekiera.budgetify.exception.UserAlreadyExistsException;
import pl.siekiera.budgetify.service.AccountService;
import pl.siekiera.budgetify.service.AuthenticationService;

import javax.validation.Valid;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class UserController {

    AccountService accountService;
    AuthenticationService authenticationService;

    @PostMapping
    public ResponseEntity<LoginResponse> createUser(@Valid @RequestBody RegisterRequestBody request) {
        try {
            LoginResponse body = authenticationService.register(request);
            return new ResponseEntity<>(body, HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> signIn(@Valid @RequestBody LoginRequestBody request) {
        LoginResponse body = authenticationService.signIn(request);
        if (body == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    @GetMapping("/find")
    public ResponseEntity<SearchUsersResponse> findUsers(@RequestParam(name = "term") String searchTerm,
                                                         @RequestParam(name = "page", required =
                                                             false, defaultValue = "0") int page,
                                                         Authentication auth) {
        User me = (User) auth.getPrincipal();
        Page<User> users = accountService.findUsers(searchTerm, page, me);
        return new ResponseEntity<>(new SearchUsersResponse(users, searchTerm), HttpStatus.OK);
    }

}
