package pl.siekiera.budgetify.dto.incoming;

import lombok.Value;
import pl.siekiera.budgetify.validation.Name;

import javax.validation.constraints.NotNull;
import java.util.Set;

@Value
public class CreateGroupRequest {

    @Name
    String name;

    String avatar;

    @NotNull
    Set<Long> members;

}
