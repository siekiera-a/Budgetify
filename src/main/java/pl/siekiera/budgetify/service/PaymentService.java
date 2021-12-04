package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.InvoiceItemRequest;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.model.Payment;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    Map<UserEntity, Double> calculatePayments(List<InvoiceItemRequest> items);

    PaymentEntity createNewPayment(Payment payment);

}
