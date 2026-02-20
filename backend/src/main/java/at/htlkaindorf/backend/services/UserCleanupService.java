package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCleanupService {
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 3 * * *")
    public void deleteUnverifiedUsers() {
        List<User> unverifiedUsers = userRepository
                .findByEnabledFalseAndEmailVerificationExpiryBefore(LocalDateTime.now());

        if (!unverifiedUsers.isEmpty()) {
            userRepository.deleteAll(unverifiedUsers);
            log.info("Deleted " + unverifiedUsers.size() + " unverified users.");
        }
    }

    @Scheduled(cron = "0 0 3 * * *")
    public void deleteInactiveAppUsers() {
        List<User> inactive = userRepository
                .findByRolesContainingAndCreatedAtBefore(Role.APP_USER, LocalDateTime.now().minusYears(1));
    }
}
