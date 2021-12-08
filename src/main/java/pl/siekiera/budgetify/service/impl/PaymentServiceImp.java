package pl.siekiera.budgetify.service.impl;

import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.InvoiceItemRequest;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.PaymentHistoryEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.model.AbstractGroupInvoice;
import pl.siekiera.budgetify.model.InvoicePaymentSettlement;
import pl.siekiera.budgetify.model.InvoiceToPay;
import pl.siekiera.budgetify.model.InvoiceToSettlement;
import pl.siekiera.budgetify.model.Payment;
import pl.siekiera.budgetify.model.PaymentWithStatus;
import pl.siekiera.budgetify.repository.PaymentRepository;
import pl.siekiera.budgetify.repository.PaymentStatusRepository;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.PaymentService;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImp implements PaymentService {

    UserRepository userRepository;
    PaymentRepository paymentRepository;
    Map<PaymentStatusEnumEntity, PaymentStatusEntity> paymentStatuses = new HashMap<>();

    public PaymentServiceImp(UserRepository userRepository,
                             PaymentStatusRepository paymentStatusRepository,
                             PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        for (PaymentStatusEnumEntity status : PaymentStatusEnumEntity.values()) {
            paymentStatuses.put(status, paymentStatusRepository.findByName(status));
        }
    }

    @Override
    public Map<UserEntity, Double> calculatePayments(List<InvoiceItemRequest> items) {
        Map<Integer, Double> payments = new HashMap<>();
        items.forEach(item -> {
            double fee = item.getPrice() / item.getAssignedUsers().size();
            item.getAssignedUsers().forEach(user -> {
                double currentFee = payments.getOrDefault(user, 0.0);
                currentFee += fee;
                payments.put(user, currentFee);
            });
        });
        return payments.entrySet().stream().map(entry -> {
            var userId = entry.getKey().longValue();
            var userWrapper = userRepository.findById(userId);
            var user = userWrapper.orElseThrow(() -> new IllegalStateException(String.format(
                "User " +
                    "with id: %d not " +
                    "found!", userId
            )));
            return Map.entry(user, entry.getValue());
        }).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public PaymentEntity createNewPayment(Payment payment, UserEntity owner) {
        PaymentStatusEntity status =
            paymentStatuses.get(payment.getAssignee().getId() == owner.getId() ?
                PaymentStatusEnumEntity.CLOSED : PaymentStatusEnumEntity.OPENED);

        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setPrice(payment.getPrice());
        paymentEntity.setInvoice(payment.getInvoice());
        paymentEntity.setUser(payment.getAssignee());

        PaymentHistoryEntity paymentHistoryEntity = new PaymentHistoryEntity();
        paymentHistoryEntity.setPayment(paymentEntity);
        paymentHistoryEntity.setStatus(status);

        paymentEntity.setPaymentHistory(Set.of(paymentHistoryEntity));
        return paymentEntity;
    }

    @Override
    public List<PaymentWithStatus> getPayments(InvoiceEntity invoice) {
        return paymentRepository.findInvoicePayments(invoice).stream()
            .map(payment -> {
                var status = payment.getPaymentHistory().stream()
                    .max(Comparator.comparing(PaymentHistoryEntity::getTime))
                    .orElseThrow(() -> new IllegalStateException(String.format("Payment with id =" +
                        " %d without history!", payment.getId())));
                return new PaymentWithStatus(payment.getId(), payment.getPrice(),
                    status.getStatus().getName(), payment.getUser());
            })
            .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public InvoicePaymentSettlement getSettlement(List<PaymentWithStatus> payments,
                                                  double totalPrice) {
        return payments.stream()
            .reduce(new InvoicePaymentSettlement(totalPrice, 0, 0, 0),
                (acc, payment) -> {
                    var price = payment.getPrice();
                    var total = acc.getTotalPrice();
                    var paid = acc.getPaid();
                    var inSettlement = acc.getInSettlement();
                    var waitForPayment = acc.getWaitForPayment();
                    switch (payment.getStatus()) {
                        case CLOSED:
                            return new InvoicePaymentSettlement(total, price + paid, inSettlement
                                , waitForPayment);
                        case OPENED:
                        case REJECTED:
                            return new InvoicePaymentSettlement(total, paid, inSettlement,
                                price + waitForPayment);
                        case PENDING:
                        case REOPENED:
                            return new InvoicePaymentSettlement(total, paid, inSettlement + price
                                , waitForPayment);
                    }
                    throw new IllegalStateException(String.format("Payment with id = %d has no " +
                        "status!", payment.getId()));
                }, InvoicePaymentSettlement::combiner);
    }

    @Override
    public UserPaymentsSummary getUserPaymentsSummary(List<AbstractGroupInvoice> invoices) {
        double toPay = invoices.stream()
            .filter(invoice -> {
                if (invoice instanceof InvoiceToPay) {
                    var invoiceToPay = (InvoiceToPay) invoice;
                    return !PaymentStatusEnumEntity.CLOSED.equals(invoiceToPay.getStatus());
                }
                return false;
            })
            .mapToDouble(AbstractGroupInvoice::getTotalPrice)
            .sum();

        double toReturn = invoices.stream()
            .filter(invoice -> invoice instanceof InvoiceToSettlement)
            .mapToDouble(i -> {
                var invoice = (InvoiceToSettlement) i;
                return invoice.getWaitForPayment() + invoice.getInSettlement();
            })
            .sum();

        return new UserPaymentsSummary(toPay, toReturn);
    }
}
