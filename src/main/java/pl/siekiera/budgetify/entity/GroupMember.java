package pl.siekiera.budgetify.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import pl.siekiera.budgetify.entity.pk.GroupMemberId;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@IdClass(GroupMemberId.class)
public class GroupMember {

    @Id
    @ManyToOne
    User user;

    @Id
    @ManyToOne
    Group group;

    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime joinTime;

    String nick;

}
