package pl.siekiera.budgetify.dto.incoming;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Value;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Value
public class PhoneNumberRequest {

    @NotBlank
    @Pattern(regexp = "^\\d{9}$")
    String phoneNumber;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public PhoneNumberRequest(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

}
