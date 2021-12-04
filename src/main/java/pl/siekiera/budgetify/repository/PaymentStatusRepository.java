package pl.siekiera.budgetify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.siekiera.budgetify.entity.PaymentStatusEntity;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;

@Repository
public interface PaymentStatusRepository extends JpaRepository<PaymentStatusEntity, Long> {

    PaymentStatusEntity findByName(PaymentStatusEnumEntity name);

}
