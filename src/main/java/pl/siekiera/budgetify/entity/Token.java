package pl.siekiera.budgetify.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Persistable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Token implements Persistable<String> {

    @Id
    String value;

    @Column(nullable = false)
    LocalDateTime expirationTime;

    @Override
    public String getId() {
        return value;
    }

    @Override
    public boolean isNew() {
        return true;
    }
}
