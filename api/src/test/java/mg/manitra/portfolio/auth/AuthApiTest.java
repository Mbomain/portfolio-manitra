package mg.manitra.portfolio.auth;

import static mg.manitra.portfolio.AdminSession.PASSWORD;
import static mg.manitra.portfolio.AdminSession.USERNAME;
import static mg.manitra.portfolio.AdminSession.credentialsJson;
import static org.assertj.core.api.Assertions.assertThat;

import mg.manitra.portfolio.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class AuthApiTest {

  @Autowired
  MockMvcTester mvc;

  @Test
  void issues_a_token_for_the_admin() {
    var result = login(credentialsJson(USERNAME, PASSWORD));

    assertThat(result).hasStatusOk();
    assertThat(result).bodyJson().extractingPath("$.token").asString().isNotBlank();
    assertThat(result).bodyJson().extractingPath("$.expiresAt").isNotNull();
  }

  @Test
  void rejects_a_wrong_password() {
    var result = login(credentialsJson(USERNAME, "not-the-password"));

    assertThat(result).hasStatus(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void rejects_blank_credentials() {
    var result = login(credentialsJson("", ""));

    assertThat(result).hasStatus(HttpStatus.BAD_REQUEST);
  }

  private MvcTestResult login(String body) {
    return mvc.post().uri(AuthController.LOGIN_PATH)
        .contentType(MediaType.APPLICATION_JSON)
        .content(body)
        .exchange();
  }
}
