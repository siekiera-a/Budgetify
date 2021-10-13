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
import javax.persistence.JoinColumn;
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
@Table(name = "p_user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(unique = true, nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    String name;

    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime registrationTime;

    String blikNumber;
    String bankAccount;
    String avatar;

    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "user_id")
    Set<TokenEntity> tokens = new HashSet<>();

    @OneToMany(mappedBy = "user")
    Set<GroupMemberEntity> groups = new HashSet<>();

    @OneToMany(mappedBy = "owner")
    Set<GroupEntity> ownedGroups = new HashSet<>();

    @OneToMany(mappedBy = "user")
    Set<InvoiceEntity> invoices = new HashSet<>();

    @OneToMany(mappedBy = "user")
    Set<PaymentEntity> payments = new HashSet<>();

    public UserEntity(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }

}
