package mg.manitra.portfolio.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import mg.manitra.portfolio.auth.TokenService.AccessToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

  public static final String LOGIN_PATH = "/api/auth/login";

  private final AuthenticationManager authenticationManager;
  private final TokenService tokenService;

  @PostMapping(LOGIN_PATH)
  public AccessToken login(@Valid @RequestBody Credentials credentials) {
    var authentication = authenticationManager.authenticate(
        UsernamePasswordAuthenticationToken.unauthenticated(credentials.username(), credentials.password()));
    return tokenService.issueFor(authentication);
  }

  public record Credentials(@NotBlank String username, @NotBlank String password) {}
}
