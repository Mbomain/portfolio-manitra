package mg.manitra.portfolio.auth;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import mg.manitra.portfolio.shared.CrudController;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableConfigurationProperties(SecurityProperties.class)
public class SecurityConfig {

  public static final String ADMIN_ROLE = "ADMIN";

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(requests -> requests
            .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
            .requestMatchers(HttpMethod.POST, AuthController.LOGIN_PATH).permitAll()
            .anyRequest().hasRole(ADMIN_ROLE))
        .oauth2ResourceServer(server -> server.jwt(jwt -> jwt.jwtAuthenticationConverter(rolesFromToken())))
        .build();
  }

  private static JwtAuthenticationConverter rolesFromToken() {
    var authorities = new JwtGrantedAuthoritiesConverter();
    authorities.setAuthoritiesClaimName(TokenService.ROLES_CLAIM);
    authorities.setAuthorityPrefix(TokenService.ROLE_PREFIX);
    var converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(authorities);
    return converter;
  }

  @Bean
  UserDetailsService adminAccount(SecurityProperties properties) {
    var admin = User.withUsername(properties.adminUsername())
        .password(properties.adminPasswordHash())
        .roles(ADMIN_ROLE)
        .build();
    return new InMemoryUserDetailsManager(admin);
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  AuthenticationManager authenticationManager(UserDetailsService users, PasswordEncoder passwordEncoder) {
    var provider = new DaoAuthenticationProvider(users);
    provider.setPasswordEncoder(passwordEncoder);
    return new ProviderManager(provider);
  }

  @Bean
  SecretKey jwtSigningKey(SecurityProperties properties) {
    return new SecretKeySpec(properties.jwtSecret().getBytes(UTF_8), "HmacSHA256");
  }

  @Bean
  JwtEncoder jwtEncoder(SecretKey jwtSigningKey) {
    return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSigningKey));
  }

  @Bean
  JwtDecoder jwtDecoder(SecretKey jwtSigningKey) {
    return NimbusJwtDecoder.withSecretKey(jwtSigningKey).macAlgorithm(MacAlgorithm.HS256).build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource(SecurityProperties properties) {
    var cors = new CorsConfiguration();
    cors.setAllowedOrigins(properties.allowedOrigins());
    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    cors.setExposedHeaders(List.of(CrudController.TOTAL_COUNT_HEADER));
    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", cors);
    return source;
  }
}
