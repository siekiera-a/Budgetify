package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.UserEntity;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    @Query("select p from PaymentEntity p join fetch p.paymentHistory as ph " +
        "join fetch ph.status join fetch p.user where p.invoice = " +
        ":invoice")
    Set<PaymentEntity> findInvoicePayments(@Param("invoice") InvoiceEntity invoice);

    @Query("select p from PaymentEntity p join fetch p.invoice i join fetch i.user join fetch i" +
        ".group join fetch p.paymentHistory ph join fetch ph.status where p.user = :user and p" +
        ".invoice.user <> :user")
    Set<PaymentEntity> findUserReceivables(@Param("user") UserEntity user);

    @Query("select p from PaymentEntity p join fetch p.invoice i join fetch p.user join fetch i" +
        ".group join fetch p.paymentHistory ph join fetch ph.status where i.user = :user and p" +
        ".user <> :user")
    Set<PaymentEntity> findPaymentForSettlement(@Param("user") UserEntity user);

    @Query("select p from PaymentEntity p join fetch p.paymentHistory ph join fetch ph.status " +
        "where p.id = :id and p.user = :user")
    Optional<PaymentEntity> findUserPaymentToPay(@Param("id") long paymentId,
                                                 @Param("user") UserEntity user);

    @Query("select p from PaymentEntity p join fetch p.paymentHistory ph join fetch ph.status " +
        "where p.id = :id and p.invoice.user = :user")
    Optional<PaymentEntity> findPaymentToSettle(@Param("id") long paymentId,
                                                @Param("user") UserEntity user);

    @Query("select p from PaymentEntity p join fetch p.user join fetch p.paymentHistory ph join " +
        "fetch ph.status join InvoiceEntity i on p.invoice = i where i.user = :user and i.settled" +
        " = false and p.user <> :user")
    Set<PaymentEntity> findPaymentsToReturn(@Param("user") UserEntity user);

    @Query("select p from PaymentEntity p join fetch p.paymentHistory ph join fetch ph.status " +
        "join InvoiceEntity i on p.invoice = i where i.user = :user and i.addTime between :from " +
        "and :to and p.user <> :user")
    Set<PaymentEntity> findCreatedPaymentsFromTimeRange(@Param("user") UserEntity user, @Param(
        "from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("select p from PaymentEntity p join fetch p.paymentHistory ph join fetch ph.status " +
        "where p.user = :user and ph.time between :from and :to")
    Set<PaymentEntity> findAssignedPaymentsFromTimeRange(@Param("user") UserEntity user, @Param(
        "from") LocalDateTime from, @Param("to") LocalDateTime to);

}
