package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceEntity;

import java.time.LocalDateTime;

@Value
public class Invoice {

    long id;
    UserWithConfidential issuer;
    Group group;
    String name;
    LocalDateTime creationTime;

    public Invoice(InvoiceEntity invoice) {
        id = invoice.getId();
        issuer = new UserWithConfidential(invoice.getUser());
        group = new Group(invoice.getGroup());
        name = invoice.getName();
        creationTime = invoice.getAddTime();
    }

}
