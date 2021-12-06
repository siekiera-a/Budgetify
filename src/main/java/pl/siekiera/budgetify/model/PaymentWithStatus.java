package pl.siekiera.budgetify.model;

import lombok.Value;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;
import pl.siekiera.budgetify.entity.UserEntity;

@Value
public class PaymentWithStatus {

    long id;
    double price;
    PaymentStatusEnumEntity status;
    UserEntity assignee;

}
