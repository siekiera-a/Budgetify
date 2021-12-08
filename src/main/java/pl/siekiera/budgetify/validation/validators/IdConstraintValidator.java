package pl.siekiera.budgetify.validation.validators;

import pl.siekiera.budgetify.validation.Id;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IdConstraintValidator implements ConstraintValidator<Id, Long> {

    @Override
    public void initialize(Id constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Long value, ConstraintValidatorContext context) {
        return value != null && value > 0;
    }

}
