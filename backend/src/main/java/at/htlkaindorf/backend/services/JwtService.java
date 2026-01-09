package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.models.TenantMembership;
import at.htlkaindorf.backend.models.documents.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpirationInMs;

    public String generateToken(User user, TenantMembership membership) {
        return Jwts.builder()
                .subject(user.getId().toHexString())
                .claim("tenantId", membership.getTenantId().toHexString())
                .claim("role", membership.getRole().name())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();

    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String userId = extractUserId(token);

        return (userId.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

}
