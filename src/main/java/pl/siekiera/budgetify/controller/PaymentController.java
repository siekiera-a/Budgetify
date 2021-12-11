package pl.siekiera.budgetify.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.siekiera.budgetify.dto.outgoing.PaymentResponse;
import pl.siekiera.budgetify.dto.outgoing.SuccessResponse;
import pl.siekiera.budgetify.entity.PaymentStatusEnumEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping(path = "/payments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class PaymentController {

    PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getReceivables(@RequestParam("status") PaymentStatusEnumEntity status, Authentication authentication) {
        var me = (UserEntity) authentication.getPrincipal();
        return ResponseEntity.ok(paymentService.getReceivables(me, status));
    }

    @GetMapping("/forSettlement")
    public ResponseEntity<List<PaymentResponse>> getPaymentsForSettlement(Authentication authentication) {
        var me = (UserEntity) authentication.getPrincipal();
        return ResponseEntity.ok(paymentService.getPaymentsForSettlement(me));
    }

    @PostMapping("/pay/{id}")
    public ResponseEntity<SuccessResponse> pay(@PathVariable(name = "id") long paymentId,
                                               Authentication authentication) {
        var me = (UserEntity) authentication.getPrincipal();
        return ResponseEntity.ok(new SuccessResponse(paymentService.pay(paymentId, me)));
    }

}
