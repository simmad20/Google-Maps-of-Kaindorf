package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.exceptions.NotFoundException;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public UserDetails loadUserById(String id) throws UsernameNotFoundException {
        return userRepository.findById(new ObjectId(id))
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
    }
}
