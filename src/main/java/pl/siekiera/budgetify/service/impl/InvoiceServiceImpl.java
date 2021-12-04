package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.CreateInvoiceRequest;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.InvoiceItemEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.PhotoEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.exception.GroupNotFoundException;
import pl.siekiera.budgetify.exception.IllegalActionException;
import pl.siekiera.budgetify.model.Payment;
import pl.siekiera.budgetify.repository.GroupRepository;
import pl.siekiera.budgetify.repository.InvoiceRepository;
import pl.siekiera.budgetify.service.InvoiceService;
import pl.siekiera.budgetify.service.PaymentService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class InvoiceServiceImpl implements InvoiceService {

    GroupRepository groupRepository;
    InvoiceRepository invoiceRepository;
    PaymentService paymentService;

    @Override
    public InvoiceEntity createInvoice(CreateInvoiceRequest invoice, UserEntity issuer) throws GroupNotFoundException, IllegalActionException {
        Optional<GroupEntity> groupWrapper = groupRepository.findById(invoice.getGroupId());

        if (groupWrapper.isEmpty()) {
            throw new GroupNotFoundException(String.format("Group with id %d not found!",
                invoice.getGroupId()));
        }

        GroupEntity group = groupWrapper.get();
        boolean isMember = groupRepository.isMember(group, issuer);

        if (!isMember) {
            throw new IllegalActionException(String.format("User with id %d is not a member of " +
                "group with id %d", issuer.getId(), group.getId()));
        }

        InvoiceEntity invoiceEntity = new InvoiceEntity();
        invoiceEntity.setGroup(group);
        invoiceEntity.setUser(issuer);
        invoiceEntity.setPhotos(invoice.getImages().stream().map(image -> {
            PhotoEntity entity = new PhotoEntity();
            entity.setInvoice(invoiceEntity);
            entity.setPath(image);
            return entity;
        }).collect(Collectors.toSet()));

        List<InvoiceItemEntity> invoiceItems = invoice.getItems().stream()
            .map(item -> new InvoiceItemEntity(item, invoiceEntity))
            .collect(Collectors.toUnmodifiableList());

        invoiceEntity.setItems(invoiceItems);

        Map<UserEntity, Double> payments = paymentService.calculatePayments(invoice.getItems());

        Set<PaymentEntity> paymentsEntities = payments.entrySet().stream().map(entry -> {
            Payment payment = new Payment(invoiceEntity, entry.getKey(), entry.getValue());
            return paymentService.createNewPayment(payment);
        }).collect(Collectors.toUnmodifiableSet());

        invoiceEntity.setPayments(paymentsEntities);

        return invoiceRepository.save(invoiceEntity);
    }

}
