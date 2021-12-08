package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.InvoiceItemRequest;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.model.AbstractGroupInvoice;
import pl.siekiera.budgetify.model.InvoicePaymentSettlement;
import pl.siekiera.budgetify.model.Payment;
import pl.siekiera.budgetify.model.PaymentWithStatus;
import pl.siekiera.budgetify.service.impl.UserPaymentsSummary;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    Map<UserEntity, Double> calculatePayments(List<InvoiceItemRequest> items);

    PaymentEntity createNewPayment(Payment payment, UserEntity owner);

    List<PaymentWithStatus> getPayments(InvoiceEntity invoice);

    InvoicePaymentSettlement getSettlement(List<PaymentWithStatus> payments, double totalPrice);

    UserPaymentsSummary getUserPaymentsSummary(List<AbstractGroupInvoice> invoices);

}
