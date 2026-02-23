package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.UserDTO;
import at.htlkaindorf.backend.models.documents.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface UserMapper {
    UserDTO toDto(User user);

    User toEntity(UserDTO userDTO);
}
