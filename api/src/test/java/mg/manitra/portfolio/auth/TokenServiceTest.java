package mg.manitra.portfolio.auth;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.assertj.core.api.Assertions.assertThat;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

class TokenServiceTest {

  private static final SecretKeySpec KEY =
      new SecretKeySpec("unit-test-secret-that-is-long-enough!!".getBytes(UTF_8), "HmacSHA256");
  private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.SECONDS);

  private final SecurityProperties properties =
      new SecurityProperties("admin", "{noop}x", "unused", Duration.ofHours(2), List.of("http://localhost"));
  private final TokenService tokenService = new TokenService(
      new NimbusJwtEncoder(new ImmutableSecret<>(KEY)), properties, Clock.fixed(NOW, ZoneOffset.UTC));

  @Test
  void signs_a_token_carrying_the_admin_roles_and_expiry() {
    var admin = UsernamePasswordAuthenticationToken.authenticated(
        "admin", null, AuthorityUtils.createAuthorityList("ROLE_ADMIN", "FACTOR_PASSWORD"));

    var accessToken = tokenService.issueFor(admin);

    var jwt = NimbusJwtDecoder.withSecretKey(KEY).macAlgorithm(MacAlgorithm.HS256).build().decode(accessToken.token());
    assertThat(jwt.getSubject()).isEqualTo("admin");
    assertThat(jwt.getClaimAsStringList(TokenService.ROLES_CLAIM)).containsExactly("ADMIN");
    assertThat(accessToken.expiresAt()).isEqualTo(NOW.plus(Duration.ofHours(2)));
    assertThat(jwt.getExpiresAt()).isEqualTo(accessToken.expiresAt());
  }
}
