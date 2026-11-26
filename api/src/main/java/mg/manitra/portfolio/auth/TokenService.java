package mg.manitra.portfolio.auth;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

  public static final String ROLES_CLAIM = "roles";
  public static final String ROLE_PREFIX = "ROLE_";

  private final JwtEncoder encoder;
  private final SecurityProperties properties;
  private final Clock clock;

  public AccessToken issueFor(Authentication authentication) {
    var issuedAt = Instant.now(clock);
    var expiresAt = issuedAt.plus(properties.tokenTtl());
    var claims = JwtClaimsSet.builder()
        .subject(authentication.getName())
        .issuedAt(issuedAt)
        .expiresAt(expiresAt)
        .claim(ROLES_CLAIM, rolesOf(authentication))
        .build();
    var header = JwsHeader.with(MacAlgorithm.HS256).build();
    var token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    return new AccessToken(token, expiresAt);
  }

  private static List<String> rolesOf(Authentication authentication) {
    return authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .filter(authority -> authority.startsWith(ROLE_PREFIX))
        .map(authority -> authority.substring(ROLE_PREFIX.length()))
        .toList();
  }

  public record AccessToken(String token, Instant expiresAt) {}
}
