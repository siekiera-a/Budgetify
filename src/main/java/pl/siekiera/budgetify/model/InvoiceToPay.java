package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;

@Value
public class InvoiceToPay extends AbstractGroupInvoice {

    PaymentStatusEnumEntity status;

    public InvoiceToPay(InvoiceEntity invoice, double totalPrice, PaymentStatusEnumEntity status) {
        super(invoice.getId(), invoice.getName(), invoice.getAddTime(), totalPrice);
        this.status = status;
    }

}
