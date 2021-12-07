package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.siekiera.budgetify.dto.incoming.CreateInvoiceRequest;
import pl.siekiera.budgetify.dto.outgoing.InvoiceResponse;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.InvoiceItemEntity;
import pl.siekiera.budgetify.entity.PaymentEntity;
import pl.siekiera.budgetify.entity.PhotoEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.exception.GroupNotFoundException;
import pl.siekiera.budgetify.exception.IllegalActionException;
import pl.siekiera.budgetify.model.AbstractGroupInvoice;
import pl.siekiera.budgetify.model.InvoiceToPay;
import pl.siekiera.budgetify.model.InvoiceToSettlement;
import pl.siekiera.budgetify.model.Payment;
import pl.siekiera.budgetify.repository.GroupRepository;
import pl.siekiera.budgetify.repository.InvoiceRepository;
import pl.siekiera.budgetify.service.InvoiceService;
import pl.siekiera.budgetify.service.PaymentService;

import java.util.ArrayList;
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
        invoiceEntity.setName(invoice.getName());

        Map<UserEntity, Double> payments = paymentService.calculatePayments(invoice.getItems());

        Set<PaymentEntity> paymentsEntities = payments.entrySet().stream().map(entry -> {
            Payment payment = new Payment(invoiceEntity, entry.getKey(), entry.getValue());
            return paymentService.createNewPayment(payment, issuer);
        }).collect(Collectors.toUnmodifiableSet());

        invoiceEntity.setPayments(paymentsEntities);

        return invoiceRepository.save(invoiceEntity);
    }

    @Override
    public List<AbstractGroupInvoice> getPaymentsInGroup(UserEntity user, GroupEntity group) {
        var invoices = new ArrayList<AbstractGroupInvoice>();
        var groupInvoices = invoiceRepository.findInvoicesInGroup(group);
        var userId = user.getId();

        groupInvoices.stream()
            .filter(invoice -> !invoice.isSettled() && invoice.getUser().getId() == userId)
            .map(invoice -> {
                var totalPrice = getTotalPrice(invoice);
                var payments = paymentService.getPayments(invoice);
                var settlement = paymentService.getSettlement(payments, totalPrice);
                return new InvoiceToSettlement(invoice, settlement);
            })
            .forEach(invoices::add);

        groupInvoices.stream()
            .filter(invoice -> !invoice.isSettled() && invoice.getUser().getId() != userId)
            .map(invoice -> {
                var userPayment = paymentService.getPayments(invoice).stream()
                    .filter(payment -> payment.getAssignee().getId() == userId)
                    .findFirst();

                var invoiceWrapper = userPayment.map(payment -> new InvoiceToPay(invoice,
                    payment.getPrice(),
                    payment.getStatus()));
                return invoiceWrapper.orElseGet(() -> new InvoiceToPay(invoice, 0, null));
            })
            .forEach(invoices::add);

        return invoices;
    }

    @Override
    public double getTotalPrice(InvoiceEntity invoice) {
        return invoice.getItems().stream()
            .mapToDouble(InvoiceItemEntity::getPrice)
            .sum();
    }

    @Override
    public Optional<InvoiceResponse> getInvoice(long id) {
        return invoiceRepository.getInvoiceById(id)
            .map(invoice ->
                new InvoiceResponse(invoice, getTotalPrice(invoice))
            );
    }
}
