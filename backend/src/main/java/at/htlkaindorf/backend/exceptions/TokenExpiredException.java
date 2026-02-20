package at.htlkaindorf.backend.exceptions;

import javax.naming.AuthenticationException;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message) {
        super(message);
    }
}
