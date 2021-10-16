package pl.siekiera.budgetify.dto.incoming;

import lombok.Value;
import pl.siekiera.budgetify.model.InvoiceItem;
import pl.siekiera.budgetify.validation.Id;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Value
public class CreateInvoiceRequest {

    @Id
    long groupId;

    @NotEmpty
    List<@Valid InvoiceItem> items;

}
