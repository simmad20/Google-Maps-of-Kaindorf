package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.models.Role;
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
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpirationInMs;

    @Value("${application.security.jwt-refresh.expiration}")
    private long jwtRefreshExpirationInDays;

    public String generateToken(String userId, String tenantId, Set<Role> roles) {
        return Jwts.builder()
                .subject(userId)
                .claim("tenantId", tenantId)
                .claim("type", "ACCESS")
                .claim("roles", roles.stream().map(Enum::name).collect(Collectors.toList()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(String userId, String tenantId, Set<Role> roles) {
        return Jwts.builder()
                .subject(userId)
                .claim("tenantId", tenantId)
                .claim("type", "REFRESH")
                .claim("roles", roles.stream().map(Enum::name).collect(Collectors.toList()))
                .expiration(Date.from(Instant.now().plus(jwtRefreshExpirationInDays, ChronoUnit.DAYS)))
                .signWith(getSecretKey())
                .compact();
    }

    public boolean isTokenValid(String token) {
        return (extractAllClaims(token).get("type").equals("ACCESS") && isTokenExpired(token));
    }

    public boolean isRefreshToken(String token) {
        try {
            return "REFRESH".equals(extractAllClaims(token).get("type", String.class));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshTokenValid(String token, User user) {
        String userId = extractUserId(token);

        return (extractAllClaims(token).get("type").equals("REFRESH") && userId.equals(user.getId().toHexString()) && isTokenExpired(token));
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractTenantId(String token) {
        return extractAllClaims(token).get("tenantId", String.class);
    }

    public Set<Role> extractRoles(String token) {
        List<?> rolesRaw = extractAllClaims(token).get("roles", List.class);

        return rolesRaw.stream()
                .map(Object::toString)
                .map(Role::valueOf)
                .collect(Collectors.toSet());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return !extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}
