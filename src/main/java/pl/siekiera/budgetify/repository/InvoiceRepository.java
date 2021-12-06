package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.InvoiceEntity;

import java.util.Set;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long> {

    @Query("select i from InvoiceEntity i left join fetch i.payments left join fetch i.items join" +
        " fetch i.user where i.group = " +
        ":group")
    Set<InvoiceEntity> findInvoicesInGroup(@Param("group") GroupEntity group);

}
