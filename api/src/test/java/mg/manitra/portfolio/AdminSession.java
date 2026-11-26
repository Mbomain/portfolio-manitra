package mg.manitra.portfolio;

import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@TestComponent
@RequiredArgsConstructor
public class AdminSession {

  public static final String USERNAME = "admin";
  public static final String PASSWORD = "test-password";

  private final MockMvcTester mvc;

  @SneakyThrows
  public String bearerToken() {
    var response = mvc.post().uri("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(credentialsJson(USERNAME, PASSWORD))
        .exchange()
        .getResponse();
    return "Bearer " + JsonPath.read(response.getContentAsString(), "$.token");
  }

  public static String credentialsJson(String username, String password) {
    return """
        {"username": "%s", "password": "%s"}""".formatted(username, password);
  }
}
