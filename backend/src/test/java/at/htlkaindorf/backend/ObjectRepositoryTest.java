package at.htlkaindorf.backend;

import at.htlkaindorf.backend.repositories.ObjectRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ObjectRepositoryTest {
    @Autowired
    private ObjectRepository objectRepository;

    @Test
    void teachersExistTest() {
        assert !objectRepository.findByType("teacher").isEmpty();
    }
}
