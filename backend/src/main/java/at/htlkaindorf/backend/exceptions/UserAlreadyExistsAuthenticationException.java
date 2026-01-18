package at.htlkaindorf.backend.exceptions;

public class UserAlreadyExistsAuthenticationException extends RuntimeException {
    public UserAlreadyExistsAuthenticationException(String message) {
        super(message);
    }
}
