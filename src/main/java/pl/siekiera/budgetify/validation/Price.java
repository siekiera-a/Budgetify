package pl.siekiera.budgetify.validation;

import pl.siekiera.budgetify.validation.validators.PriceConstraintValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PriceConstraintValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Price {

    String message() default "Invalid Price";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
