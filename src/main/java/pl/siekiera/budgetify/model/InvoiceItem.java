package pl.siekiera.budgetify.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
import pl.siekiera.budgetify.entity.InvoiceItemEntity;
import pl.siekiera.budgetify.validation.Price;

import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Getter
@EqualsAndHashCode
@ToString
public class InvoiceItem {

    long id;

    @NotBlank
    String text;

    @Price
    double price;

    public InvoiceItem(InvoiceItemEntity item) {
        id = item.getId();
        text = item.getName();
        price = item.getPrice();
    }

}
