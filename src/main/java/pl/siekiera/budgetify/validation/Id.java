package pl.siekiera.budgetify.validation;

import pl.siekiera.budgetify.validation.validators.IdConstraintValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = IdConstraintValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Id {

    String message() default "Invalid Id";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
