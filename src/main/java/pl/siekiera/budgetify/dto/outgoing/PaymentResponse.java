package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;
import pl.siekiera.budgetify.model.Invoice;

@Value
public class PaymentResponse {

    long id;
    double price;
    PaymentStatusEnumEntity status;
    Invoice invoice;

    public PaymentResponse(long id, double price, PaymentStatusEnumEntity status,
                           InvoiceEntity invoice) {
        this.id = id;
        this.price = price;
        this.status = status;
        this.invoice = new Invoice(invoice);
    }
}
