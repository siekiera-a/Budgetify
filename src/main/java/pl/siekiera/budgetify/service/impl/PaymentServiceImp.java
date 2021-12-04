package pl.siekiera.budgetify.service.impl;

import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.InvoiceItemRequest;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.PaymentHistoryEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.model.Payment;
import pl.siekiera.budgetify.repository.PaymentStatusRepository;
import pl.siekiera.budgetify.repository.UserRepository;
import pl.siekiera.budgetify.service.PaymentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImp implements PaymentService {

    UserRepository userRepository;
    Map<PaymentStatusEnumEntity, PaymentStatusEntity> paymentStatuses = new HashMap<>();

    public PaymentServiceImp(UserRepository userRepository,
                             PaymentStatusRepository paymentStatusRepository) {
        this.userRepository = userRepository;
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
    public PaymentEntity createNewPayment(Payment payment) {
        PaymentStatusEntity opened = paymentStatuses.get(PaymentStatusEnumEntity.OPENED);

        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setPrice(payment.getPrice());
        paymentEntity.setInvoice(payment.getInvoice());
        paymentEntity.setUser(payment.getAssignee());

        PaymentHistoryEntity paymentHistoryEntity = new PaymentHistoryEntity();
        paymentHistoryEntity.setPayment(paymentEntity);
        paymentHistoryEntity.setStatus(opened);

        paymentEntity.setPaymentHistory(Set.of(paymentHistoryEntity));
        return paymentEntity;
    }
}
