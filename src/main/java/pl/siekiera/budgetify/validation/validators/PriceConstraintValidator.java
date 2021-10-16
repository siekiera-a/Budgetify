package pl.siekiera.budgetify.validation.validators;

import pl.siekiera.budgetify.validation.Price;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PriceConstraintValidator implements ConstraintValidator<Price, Double> {

    @Override
    public void initialize(Price constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Double value, ConstraintValidatorContext context) {
        return value != null && !value.isInfinite() && !value.isNaN() && value >= 0.0;
    }
}
