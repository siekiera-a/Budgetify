package pl.siekiera.budgetify.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime addTime;

    @ManyToOne(optional = false)
    User user;

    @ManyToOne(optional = false)
    Group group;

    @OneToMany(mappedBy = "invoice")
    List<InvoiceItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", orphanRemoval = true)
    Set<Photo> photos = new HashSet<>();

    @OneToMany(mappedBy = "invoice")
    Set<Payment> payments = new HashSet<>();

}
