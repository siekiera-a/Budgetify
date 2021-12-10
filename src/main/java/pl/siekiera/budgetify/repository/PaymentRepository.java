package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.UserEntity;

import java.util.List;
import java.util.Set;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    @Query("select p from PaymentEntity p join fetch p.paymentHistory as ph " +
        "join fetch ph.status join fetch p.user where p.invoice = " +
        ":invoice")
    List<PaymentEntity> findInvoicePayments(@Param("invoice") InvoiceEntity invoice);

    @Query("select p from PaymentEntity p join fetch p.invoice i join fetch i.user join fetch i" +
        ".group join fetch p.paymentHistory ph join fetch ph.status where p.user = :user and p" +
        ".invoice.user <> :user")
    Set<PaymentEntity> findUserReceivables(@Param("user") UserEntity user);

    @Query("select p from PaymentEntity p join fetch p.invoice i join fetch p.user join fetch i" +
        ".group join fetch p.paymentHistory ph join fetch ph.status where i.user = :user and p.user <> :user")
    Set<PaymentEntity> findPaymentForSettlement(@Param("user") UserEntity user);

}
