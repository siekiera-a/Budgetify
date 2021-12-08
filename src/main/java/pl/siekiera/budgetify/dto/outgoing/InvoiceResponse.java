package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import pl.siekiera.budgetify.entity.InvoiceEntity;
import pl.siekiera.budgetify.entity.PhotoEntity;
import pl.siekiera.budgetify.model.Group;
import pl.siekiera.budgetify.model.InvoiceItem;
import pl.siekiera.budgetify.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Value
public class InvoiceResponse {

    long id;
    User issuer;
    Group group;
    LocalDateTime creationTime;
    List<InvoiceItem> items;
    List<String> images;
    String name;
    boolean settled;
    double totalPrice;

    public InvoiceResponse(InvoiceEntity invoice, double totalPrice) {
        id = invoice.getId();
        issuer = new User(invoice.getUser());
        group = new Group(invoice.getGroup());
        creationTime = invoice.getAddTime();
        items = invoice.getItems().stream()
            .map(InvoiceItem::new)
            .collect(Collectors.toUnmodifiableList());
        images = invoice.getPhotos().stream()
            .map(PhotoEntity::getPath).collect(Collectors.toList());
        name = invoice.getName();
        settled = invoice.isSettled();
        this.totalPrice = totalPrice;
    }

}
