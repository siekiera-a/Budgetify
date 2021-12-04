package pl.siekiera.budgetify.dto.incoming;

import lombok.Value;
import pl.siekiera.budgetify.validation.Id;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;

@Value
public class CreateInvoiceRequest {

    @Id
    long groupId;

    @NotNull
    Set<String> images;

    @NotEmpty
    List<@Valid InvoiceItemRequest> items;

}
