package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.model.AbstractGroupInvoice;

import java.util.List;

@Value
public class GroupDetailsResponse extends GroupResponse {

    double toPay;
    double toReturn;
    List<AbstractGroupInvoice> invoices;

    public GroupDetailsResponse(GroupEntity group, double toPay, double toReturn,
                                List<AbstractGroupInvoice> invoices) {
        super(group);
        this.toPay = toPay;
        this.toReturn = toReturn;
        this.invoices = invoices;
    }
}
