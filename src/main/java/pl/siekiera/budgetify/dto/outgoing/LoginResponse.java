package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.model.ProfileInfo;

@Value
public class LoginResponse {

    String token;

    ProfileInfo user;

}
