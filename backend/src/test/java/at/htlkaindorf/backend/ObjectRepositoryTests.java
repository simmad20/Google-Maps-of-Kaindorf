package at.htlkaindorf.backend;

import at.htlkaindorf.backend.repositories.ObjectRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ObjectRepositoryTests {
    @Autowired
    private ObjectRepository objectRepository;

    @Test
    void teachersExistTest() {
        assert !objectRepository.findByTypeId(new ObjectId("6915b227c4dcbd5a4b392aef")).isEmpty();
    }
}
