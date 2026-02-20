package at.htlkaindorf.backend.config;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import at.htlkaindorf.backend.services.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    private final AuthContext authContext;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader("Authorization");

        if (auth == null || !auth.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = auth.substring(7);

            if (jwtService.isRefreshToken(jwt)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Refresh token not allowed here\"}");
                return;
            }
            String userId = jwtService.extractUserId(jwt);
            String tenantId = jwtService.extractTenantId(jwt);
            Set<Role> roles = jwtService.extractRoles(jwt);

            if (userId != null && tenantId != null && roles != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                if (jwtService.isTokenValid(jwt)) {

                    if (roles.contains(Role.ADMIN) || roles.contains(Role.ADMIN_VIEWER)) {
                        Optional<User> dbUser = userRepository.findById(new ObjectId(userId));

                        if (dbUser.isEmpty() || !dbUser.get().isEnabled()) {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"User no longer active\"}");
                            return;
                        }

                        roles = dbUser.get().getRoles();
                    }
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId,
                            null, roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                            .collect(Collectors.toList()));
                    authToken.setDetails(new WebAuthenticationDetailsSource()
                            .buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    authContext.setUserId(userId);
                    authContext.setTenantId(tenantId);
                    authContext.setRoles(roles);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid jwt token");
                    return;
                }
            }
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
