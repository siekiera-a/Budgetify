package pl.siekiera.budgetify.model;

import lombok.Value;

@Value
public class InvoicePaymentSettlement {

    double totalPrice;
    double paid;
    double inSettlement;
    double waitForPayment;

    public static InvoicePaymentSettlement combiner(InvoicePaymentSettlement e1,
                                             InvoicePaymentSettlement e2) {
        return new InvoicePaymentSettlement(
            Math.max(e1.getTotalPrice(), e2.getTotalPrice()),
            Math.max(e1.getPaid(), e2.getPaid()),
            Math.max(e1.getInSettlement(), e2.getInSettlement()),
            Math.max(e1.getWaitForPayment(), e2.getWaitForPayment()));
    }

}
