package pl.siekiera.budgetify.dto.incoming;

import lombok.ToString;
import lombok.Value;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Value
public class LoginRequestBody {

    @Email
    @NotBlank
    String email;

    @ToString.Exclude
    String password;

}
