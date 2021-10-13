package pl.siekiera.budgetify.validation.validators;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import pl.siekiera.budgetify.validation.Name;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class NameConstraintValidator implements ConstraintValidator<Name, String> {

    Pattern pattern;

    public NameConstraintValidator() {
        pattern = Pattern.compile("\\S.+\\S");
    }

    @Override
    public void initialize(Name constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }

        return pattern.matcher(value).matches();
    }

}
