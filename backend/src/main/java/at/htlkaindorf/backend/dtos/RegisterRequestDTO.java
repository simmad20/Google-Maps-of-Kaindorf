package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {
    private String firstname;
    private String lastname;
    private String username;
    private String password;
    private String repeatPassword;
    private String email;
}
