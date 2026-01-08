package at.htlkaindorf.backend;

import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ObjectTypeRepositoryTests {
    @Autowired
    private ObjectTypeRepository objectTypeRepository;

    @Test
    void teacherTypeExistsTest(){
        assertTrue(objectTypeRepository.findByName("Teacher").isPresent());
    }
}
