package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.siekiera.budgetify.entity.InvoiceEntity;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long> {
}
