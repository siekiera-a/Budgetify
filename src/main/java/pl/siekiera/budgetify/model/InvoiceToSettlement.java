package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceEntity;

@Value
public class InvoiceToSettlement extends AbstractGroupInvoice {

    double paid;
    double inSettlement;
    double waitForPayment;

    public InvoiceToSettlement(InvoiceEntity invoice, InvoicePaymentSettlement settlement) {
        super(invoice.getId(), invoice.getName(), invoice.getAddTime(), settlement.getTotalPrice());
        this.paid = settlement.getPaid();
        this.inSettlement = settlement.getInSettlement();
        this.waitForPayment = settlement.getWaitForPayment();
    }
}
