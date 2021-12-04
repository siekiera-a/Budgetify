package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.UserEntity;

@Value
public class Payment {

    InvoiceEntity invoice;
    UserEntity assignee;
    double price;

}
