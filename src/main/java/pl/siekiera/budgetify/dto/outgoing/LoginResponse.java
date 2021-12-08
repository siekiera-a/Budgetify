package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.model.Profile;

@Value
public class LoginResponse {

    String token;

    Profile profile;

}
