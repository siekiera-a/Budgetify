package pl.siekiera.budgetify.dto.incoming;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Value;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;


@Value
public class TokenRequest {

    @NotNull
    @NotBlank
    String token;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public TokenRequest(String token) {
        this.token = token;
    }
}
