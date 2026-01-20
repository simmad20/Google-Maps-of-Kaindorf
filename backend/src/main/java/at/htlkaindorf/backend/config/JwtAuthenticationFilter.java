package at.htlkaindorf.backend.config;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.services.CustomUserDetailsService;
import at.htlkaindorf.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuthContext authContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader("Authorization");

        if (auth == null || !auth.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = auth.substring(7);
        String userId = jwtService.extractUserId(jwt);
        ObjectId tenantId = jwtService.extractTenantId(jwt);
        Role role = jwtService.extractRole(jwt);

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = (User) customUserDetailsService.loadUserById(userId);

            if (jwtService.isTokenValid(jwt, user)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority("ROLE_" + role.name())));
                authToken.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);

                authContext.setUserId(user.getId());
                authContext.setTenantId(tenantId);
                authContext.setRole(role);
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid jwt token");
            }
        }
        filterChain.doFilter(request, response);
    }
}
