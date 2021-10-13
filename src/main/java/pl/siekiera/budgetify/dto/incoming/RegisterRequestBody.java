package pl.siekiera.budgetify.dto.incoming;

import lombok.ToString;
import lombok.Value;
import pl.siekiera.budgetify.validation.Name;
import pl.siekiera.budgetify.validation.Password;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Value
public class RegisterRequestBody {

    @Name
    String name;

    @Email
    @NotBlank
    String email;

    @Password
    @ToString.Exclude
    String password;

}
