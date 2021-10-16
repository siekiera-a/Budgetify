package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceItemEntity;
import pl.siekiera.budgetify.validation.Price;

import javax.validation.constraints.NotBlank;

@Value
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

    public InvoiceItem(long id, String text, double price) {
        this.id = id;
        this.text = text;
        this.price = price;
    }
}
