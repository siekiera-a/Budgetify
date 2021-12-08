package pl.siekiera.budgetify.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.siekiera.budgetify.dto.incoming.CreateInvoiceRequest;
import pl.siekiera.budgetify.dto.outgoing.InvoiceResponse;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.exception.GroupNotFoundException;
import pl.siekiera.budgetify.exception.IllegalActionException;
import pl.siekiera.budgetify.service.InvoiceService;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "/invoice")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class InvoiceController {

    InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(@RequestBody @Valid CreateInvoiceRequest request,
                                                         Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        try {
            var invoiceEntity = invoiceService.createInvoice(request, user);
            var totalPrice = invoiceService.getTotalPrice(invoiceEntity);
            return new ResponseEntity<>(new InvoiceResponse(invoiceEntity, totalPrice),
                HttpStatus.CREATED);
        } catch (IllegalActionException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        } catch (GroupNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getInvoice(@PathVariable long id) {
        var invoiceWrapper = invoiceService.getInvoice(id);
        if (invoiceWrapper.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(invoiceWrapper.get());
    }

}
