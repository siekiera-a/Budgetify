package pl.siekiera.budgetify.dto.incoming;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Value;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Value
public class BankAccountRequest {

    @NotBlank
    @Pattern(regexp = "^\\d{26}$")
    String bankAccount;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public BankAccountRequest(String bankAccount) {
        this.bankAccount = bankAccount;
    }

}
