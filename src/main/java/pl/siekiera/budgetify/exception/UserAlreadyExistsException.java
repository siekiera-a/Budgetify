package pl.siekiera.budgetify.exception;

public class UserAlreadyExistsException extends Exception {

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

}
