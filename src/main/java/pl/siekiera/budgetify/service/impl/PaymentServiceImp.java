package pl.siekiera.budgetify.service.impl;

import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.InvoiceItemRequest;
import pl.siekiera.budgetify.dto.outgoing.PaymentResponse;
import pl.siekiera.budgetify.dto.outgoing.UserPaymentResponse;
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
import pl.siekiera.budgetify.model.TimeRangeSummary;
import pl.siekiera.budgetify.model.User;
import pl.siekiera.budgetify.repository.PaymentRepository;
import pl.siekiera.budgetify.repository.PaymentStatusRepository;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.PaymentService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
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
                var status = getPaymentStatus(payment);
                return new PaymentWithStatus(payment.getId(), payment.getPrice(),
                    status.getStatus().getName(), payment.getUser());
            })
            .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public PaymentHistoryEntity getPaymentStatus(PaymentEntity payment) {
        return payment.getPaymentHistory().stream()
            .max(Comparator.comparing(PaymentHistoryEntity::getTime))
            .orElseThrow(() -> new IllegalStateException(String.format("Payment with id =" +
                " %d without history!", payment.getId())));
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

    @Override
    public List<PaymentResponse> getReceivables(UserEntity user, PaymentStatusEnumEntity status) {
        return paymentRepository.findUserReceivables(user).stream()
            .filter(payment -> {
                var paymentStatus = getPaymentStatus(payment);
                return status.equals(paymentStatus.getStatus().getName());
            })
            .map(payment ->
                new PaymentResponse(payment.getId(), payment.getPrice(), status,
                    payment.getInvoice())
            )
            .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getPaymentsForSettlement(UserEntity user) {
        return paymentRepository.findPaymentForSettlement(user).stream()
            .filter(payment ->
                PaymentStatusEnumEntity.PENDING.equals(getPaymentStatus(payment).getStatus().getName())
            )
            .map(payment ->
                new PaymentResponse(payment.getId(), payment.getPrice(),
                    PaymentStatusEnumEntity.PENDING, payment.getInvoice(), payment.getUser())
            )
            .collect(Collectors.toList());
    }

    @Override
    public boolean pay(long paymentId, UserEntity user) {
        Predicate<PaymentStatusEnumEntity> invalidStatePredicate =
            (status) -> PaymentStatusEnumEntity.PENDING.equals(status)
                || PaymentStatusEnumEntity.CLOSED.equals(status);
        return settle(paymentId, user, invalidStatePredicate, PaymentStatusEnumEntity.PENDING);
    }

    @Override
    public boolean accept(long paymentId, UserEntity user) {
        Predicate<PaymentStatusEnumEntity> invalidStatePredicate =
            (status) -> !PaymentStatusEnumEntity.PENDING.equals(status);
        return settle(paymentId, user, invalidStatePredicate, PaymentStatusEnumEntity.CLOSED);
    }

    @Override
    public boolean reject(long paymentId, UserEntity user) {
        Predicate<PaymentStatusEnumEntity> invalidStatePredicate =
            (status) -> !PaymentStatusEnumEntity.PENDING.equals(status);
        return settle(paymentId, user, invalidStatePredicate, PaymentStatusEnumEntity.REJECTED);
    }

    private boolean settle(long paymentId, UserEntity user,
                           Predicate<PaymentStatusEnumEntity> invalidPaymentStatus,
                           PaymentStatusEnumEntity resultStatus) {
        var paymentWrapper = resultStatus == PaymentStatusEnumEntity.PENDING ?
            paymentRepository.findUserPaymentToPay(paymentId, user) :
            paymentRepository.findPaymentToSettle(paymentId, user);

        if (paymentWrapper.isEmpty()) {
            return false;
        }

        var payment = paymentWrapper.get();
        var paymentStatus = getPaymentStatus(payment).getStatus().getName();

        if (invalidPaymentStatus.test(paymentStatus)) {
            return false;
        }

        var paymentHistory = createPaymentHistory(payment, resultStatus);
        payment.getPaymentHistory().add(paymentHistory);
        paymentRepository.save(payment);
        return true;
    }

    private PaymentHistoryEntity createPaymentHistory(PaymentEntity payment,
                                                      PaymentStatusEnumEntity status) {
        var entity = new PaymentHistoryEntity();
        entity.setPayment(payment);
        entity.setStatus(paymentStatuses.get(status));
        return entity;
    }

    @Override
    public Optional<PaymentEntity> getPayment(long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public List<UserPaymentResponse> getPaymentsToReturn(UserEntity user) {
        var payments = paymentRepository.findPaymentsToReturn(user);
        var userPaymentMap = payments.stream()
            .filter(payment -> {
                var status = getPaymentStatus(payment).getStatus().getName();
                return PaymentStatusEnumEntity.OPENED.equals(status) || PaymentStatusEnumEntity.REJECTED.equals(status);
            })
            .map(payment ->
                new UserPaymentResponse(new User(payment.getUser()), payment.getPrice()))
            .reduce(new HashMap<User, Double>(), (acc, element) -> {
                var assignee = element.getUser();
                var totalPrice = acc.getOrDefault(assignee, 0.0);
                acc.put(assignee, totalPrice + element.getPrice());
                return acc;
            }, (e1, e2) -> {
                var map = new HashMap<>(e1);
                e2.forEach((key, value) -> {
                    var savedValue = map.getOrDefault(key, 0.0);
                    map.put(key, Math.max(savedValue, value));
                });
                return map;
            });

        return userPaymentMap.entrySet().stream()
            .map(entry -> new UserPaymentResponse(entry.getKey(), entry.getValue()))
            .sorted(Comparator.comparingDouble(UserPaymentResponse::getPrice).reversed())
            .collect(Collectors.toList());
    }

    @Override
    public TimeRangeSummary getTimeRangeSummary(LocalDateTime from, LocalDateTime to,
                                                UserEntity user) {
        var assignedPayments = paymentRepository.findAssignedPaymentsFromTimeRange(user, from, to);
        var createdPayments = paymentRepository.findCreatedPaymentsFromTimeRange(user, from, to);


        var paid = assignedPayments.stream()
            .filter(payment -> {
                var status = getPaymentStatus(payment).getStatus().getName();
                return PaymentStatusEnumEntity.CLOSED.equals(status) || PaymentStatusEnumEntity.PENDING.equals(status);
            }).mapToDouble(PaymentEntity::getPrice)
            .sum();

        var summary = createdPayments.stream()
            .map(payment -> {
                var status = getPaymentStatus(payment).getStatus().getName();
                return new PaymentWithStatus(payment.getId(), payment.getPrice(), status, null);
            })
            .reduce(
                List.of(0.0, 0.0, 0.0), // indexes: 0 - settled; 1 - inSettlement; 2 - not paid
                (acc, payment) -> {
                    var settled = acc.get(0);
                    var inSettlement = acc.get(1);
                    var notPaid = acc.get(2);
                    var value = payment.getPrice();

                    switch (payment.getStatus()) {
                        case CLOSED:
                            return List.of(settled + value, inSettlement, notPaid);
                        case PENDING:
                            return List.of(settled, inSettlement + value, notPaid);
                        case OPENED:
                        case REJECTED:
                            return List.of(settled, inSettlement, notPaid + value);
                    }
                    return acc;
                }, (e1, e2) -> {
                    ArrayList<Double> list = new ArrayList<>(e1);
                    list.addAll(e2);
                    return list;
                });

        var total = paid + summary.stream().mapToDouble(Double::valueOf).sum();
        var settled = summary.get(0);
        var inSettlement = summary.get(1);
        var notPaid = summary.get(2);

        return new TimeRangeSummary(total, paid, settled, inSettlement, notPaid, from, to);
    }
}
