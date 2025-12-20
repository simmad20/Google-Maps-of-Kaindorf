package at.htlkaindorf.backend;

import at.htlkaindorf.backend.repositories.ObjectRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class RoomRepositoryTests {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ObjectRepository objectRepository;

    @Test
    void findRoomByObjectIdTest() {
        assertTrue(roomRepository.findRoomByObjectId(objectRepository.findAll().get(0).getId()).isPresent());
    }
}
