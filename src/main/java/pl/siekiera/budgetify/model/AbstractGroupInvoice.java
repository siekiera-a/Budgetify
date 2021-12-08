package pl.siekiera.budgetify.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
abstract public class AbstractGroupInvoice {

    long id;
    String name;
    LocalDateTime creationTime;
    double totalPrice;

}
