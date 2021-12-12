package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;

import java.util.Optional;
import java.util.Set;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long> {

    @Query("select i from InvoiceEntity i left join fetch i.payments left join fetch i.items join" +
        " fetch i.user where i.group = " +
        ":group")
    Set<InvoiceEntity> findInvoicesInGroup(@Param("group") GroupEntity group);

    @Query("select i from InvoiceEntity i join fetch i.group join fetch i.user join fetch i.items" +
        " where i.id = :id")
    Optional<InvoiceEntity> getInvoiceById(@Param("id") long id);

    @Query("select i from InvoiceEntity i join fetch i.payments p join fetch p.paymentHistory ph " +
        "join fetch ph.status where :#{#payment.invoice} = i")
    InvoiceEntity getSettledInvoice(@Param("payment") PaymentEntity payment);

}
