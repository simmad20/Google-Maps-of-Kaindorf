package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.TenantMembership;
import at.htlkaindorf.backend.models.documents.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpirationInMs;

    @Value("${application.security.jwt-refresh.expiration}")
    private long jwtRefreshExpirationInDays;

    public String generateToken(User user, TenantMembership membership) {
        return Jwts.builder()
                .subject(user.getId().toHexString())
                .claim("tenantId", membership.getTenantId().toHexString())
                .claim("type", "ACCESS")
                .claim("role", membership.getRole().name())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(User user, TenantMembership membership) {
        return Jwts.builder()
                .subject(user.getId().toHexString())
                .claim("tenantId", membership.getTenantId().toHexString())
                .claim("type", "REFRESH")
                .claim("role", membership.getRole().name())
                .expiration(Date.from(Instant.now().plus(jwtRefreshExpirationInDays, ChronoUnit.DAYS)))
                .signWith(getSecretKey())
                .compact();

    }

    public boolean isTokenValid(String token, User user) {
        String userId = extractUserId(token);

        return (extractAllClaims(token).get("type").equals("ACCESS")&&userId.equals(user.getId().toHexString()) && !isTokenExpired(token));
    }

    public boolean isRefreshTokenValid(String token, User user) {
        String userId = extractUserId(token);

        return (extractAllClaims(token).get("type").equals("REFRESH")&&userId.equals(user.getId().toHexString()) && !isTokenExpired(token));
    }

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    public ObjectId extractTenantId(String token) {
        return new ObjectId(extractAllClaims(token).get("tenantId", String.class));
    }

    public Role extractRole(String token) {
        return Role.valueOf(extractAllClaims(token).get("role", String.class));
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
