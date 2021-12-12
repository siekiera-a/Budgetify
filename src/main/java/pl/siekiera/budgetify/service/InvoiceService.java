package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.CreateInvoiceRequest;
import pl.siekiera.budgetify.dto.outgoing.InvoiceResponse;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.exception.GroupNotFoundException;
import pl.siekiera.budgetify.exception.IllegalActionException;
import pl.siekiera.budgetify.model.AbstractGroupInvoice;

import java.util.List;
import java.util.Optional;

public interface InvoiceService {

    InvoiceEntity createInvoice(CreateInvoiceRequest invoice, UserEntity issuer) throws GroupNotFoundException, IllegalActionException;

    List<AbstractGroupInvoice> getPaymentsInGroup(UserEntity user, GroupEntity group);

    Optional<InvoiceResponse> getInvoice(long id);

    double getTotalPrice(InvoiceEntity invoice);

    boolean settleThePayment(long paymentId, UserEntity user);

}
