package pl.siekiera.budgetify.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.siekiera.budgetify.dto.incoming.LoginRequestBody;
import pl.siekiera.budgetify.dto.incoming.RegisterRequestBody;
import pl.siekiera.budgetify.dto.outgoing.LoginResponse;
import pl.siekiera.budgetify.exception.UserAlreadyExistsException;
import pl.siekiera.budgetify.service.AuthenticationService;

import javax.validation.Valid;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class UserController {

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

}
