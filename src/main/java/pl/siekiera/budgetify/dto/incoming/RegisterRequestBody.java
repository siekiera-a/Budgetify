package pl.siekiera.budgetify.dto.incoming;

import lombok.ToString;
import lombok.Value;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Value
public class RegisterRequestBody {

    @NotBlank
    @Pattern(regexp = "^\\S.+\\S$")
    String name;

    @Email
    @NotBlank
    String email;

    @ToString.Exclude
    String password;

}
