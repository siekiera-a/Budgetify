package pl.siekiera.budgetify.dto.incoming;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;
import pl.siekiera.budgetify.model.InvoiceItem;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Value
public class InvoiceItemRequest extends InvoiceItem {

    @NotEmpty
    Set<Integer> assignedUsers;

    @JsonCreator
    public InvoiceItemRequest(long id, @NotBlank String text,
                              @JsonProperty(value = "price", required = true) double price,
                              Set<Integer> assignedUsers) {
        super(id, text, price);
        this.assignedUsers = assignedUsers;
    }
}
