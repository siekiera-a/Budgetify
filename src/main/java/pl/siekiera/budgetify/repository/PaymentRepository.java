package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    @Query("select p from PaymentEntity p join fetch p.paymentHistory as ph " +
        "join fetch ph.status join fetch p.user where p.invoice = " +
        ":invoice")
    List<PaymentEntity> findInvoicePayments(@Param("invoice") InvoiceEntity invoice);

}
