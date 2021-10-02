package pl.siekiera.budgetify.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Persistable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Token implements Persistable<String> {

    @Id
    String value;

    @Column(nullable = false)
    LocalDateTime expirationTime;

    @ManyToOne
    User user;

    public Token(String value, LocalDateTime expirationTime) {
        this.value = value;
        this.expirationTime = expirationTime;
    }

    @Override
    public String getId() {
        return value;
    }

    @Override
    public boolean isNew() {
        return true;
    }
}
