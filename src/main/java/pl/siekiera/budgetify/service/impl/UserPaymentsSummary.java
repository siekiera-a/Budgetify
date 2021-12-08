package pl.siekiera.budgetify.service.impl;

import lombok.Value;

@Value
public class UserPaymentsSummary {

    double toPay;
    double toReturn;

}
