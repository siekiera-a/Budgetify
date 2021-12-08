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
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "p_group")
public class GroupEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(nullable = false)
    String name;

    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime creationTime;

    @ManyToOne(optional = false)
    UserEntity owner;

    String avatar;

    @OneToMany(mappedBy = "group", cascade = {CascadeType.PERSIST})
    Set<GroupMemberEntity> users = new HashSet<>();

    @OneToMany(mappedBy = "group")
    Set<InvoiceEntity> invoices = new HashSet<>();

}
