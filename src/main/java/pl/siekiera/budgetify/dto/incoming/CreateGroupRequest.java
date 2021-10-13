package pl.siekiera.budgetify.dto.incoming;

import lombok.Value;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Set;

@Value
public class CreateGroupRequest {

    @NotBlank
    @Pattern(regexp = "^\\S.+\\S$")
    String name;

    String avatar;

    @NotNull
    Set<Long> members;

}
