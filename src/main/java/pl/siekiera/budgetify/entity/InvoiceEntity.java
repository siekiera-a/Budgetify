package pl.siekiera.budgetify.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "invoice")
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime addTime;

    @ManyToOne(optional = false)
    UserEntity user;

    @ManyToOne(optional = false)
    GroupEntity group;

    String name;

    @OneToMany(mappedBy = "invoice", cascade = {CascadeType.ALL})
    List<InvoiceItemEntity> items = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", orphanRemoval = true, cascade = {CascadeType.ALL})
    Set<PhotoEntity> photos = new HashSet<>();

    @OneToMany(mappedBy = "invoice", cascade = {CascadeType.ALL})
    Set<PaymentEntity> payments = new HashSet<>();

}
