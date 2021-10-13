package pl.siekiera.budgetify.validation;

import pl.siekiera.budgetify.validation.validators.NameConstraintValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = NameConstraintValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Name {

    String message() default "Invalid Name";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
