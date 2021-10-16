package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.dto.incoming.CreateInvoiceRequest;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.exception.GroupNotFoundException;
import pl.siekiera.budgetify.exception.IllegalActionException;

public interface InvoiceService {

    InvoiceEntity createInvoice(CreateInvoiceRequest invoice, UserEntity issuer) throws GroupNotFoundException, IllegalActionException;

}
