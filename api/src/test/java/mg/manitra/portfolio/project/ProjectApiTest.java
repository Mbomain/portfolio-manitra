package mg.manitra.portfolio.project;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import com.jayway.jsonpath.JsonPath;
import lombok.SneakyThrows;
import mg.manitra.portfolio.AdminSession;
import mg.manitra.portfolio.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@Transactional
class ProjectApiTest {

  private static final String PROJECTS = "/api/projects";
  private static final String NEW_PROJECT = """
      {
        "title": "Suivi DTM",
        "category": "Full-Stack",
        "period": "2027",
        "summary": "Suivi des enquêteurs en temps réel.",
        "position": 7,
        "technologies": ["Java", "React-Admin"],
        "links": [{"label": "Voir sur GitHub", "url": "https://github.com/Mbomain"}]
      }""";

  @Autowired
  MockMvcTester mvc;

  @Autowired
  AdminSession admin;

  private String token;

  @BeforeEach
  void signIn() {
    token = admin.bearerToken();
  }

  @Test
  void lists_projects_publicly_in_display_order_with_the_total_count() {
    var result = mvc.get().uri(PROJECTS + "?_start=0&_end=2").exchange();

    assertThat(result).hasStatusOk().hasHeader("X-Total-Count", "6");
    assertThat(result).bodyJson().extractingPath("$[*].title").asArray().containsExactly("HEI Admin", "Students API");
  }

  @Test
  void returns_only_the_requested_ids() {
    var result = mvc.get().uri(PROJECTS + "?id=1&id=3").exchange();

    assertThat(result).hasStatusOk();
    assertThat(result).bodyJson().extractingPath("$[*].id").asArray().containsExactlyInAnyOrder(1, 3);
  }

  @Test
  void refuses_changes_without_a_token() {
    var result = mvc.post().uri(PROJECTS).contentType(MediaType.APPLICATION_JSON).content(NEW_PROJECT).exchange();

    assertThat(result).hasStatus(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void creates_reads_updates_and_deletes_a_project() {
    var created = authorized(mvc.post().uri(PROJECTS).contentType(MediaType.APPLICATION_JSON).content(NEW_PROJECT));
    assertThat(created).hasStatus(HttpStatus.CREATED);
    var id = idOf(created);

    var read = mvc.get().uri(PROJECTS + "/{id}", id).exchange();
    assertThat(read).bodyJson().extractingPath("$.links[0].url").isEqualTo("https://github.com/Mbomain");

    var renamed = NEW_PROJECT.replace("Suivi DTM", "Suivi DTM v2");
    var updated = authorized(mvc.put().uri(PROJECTS + "/{id}", id).contentType(MediaType.APPLICATION_JSON).content(renamed));
    assertThat(updated).bodyJson().extractingPath("$.title").isEqualTo("Suivi DTM v2");

    var deleted = authorized(mvc.delete().uri(PROJECTS + "/{id}", id));
    assertThat(deleted).hasStatusOk();
    assertThat(deleted).bodyJson().extractingPath("$.title").isEqualTo("Suivi DTM v2");
    assertThat(mvc.get().uri(PROJECTS + "/{id}", id).exchange()).hasStatus(HttpStatus.NOT_FOUND);
  }

  @Test
  void rejects_an_invalid_project() {
    var withoutTitle = NEW_PROJECT.replace("\"Suivi DTM\"", "\"\"");

    var result = authorized(mvc.post().uri(PROJECTS).contentType(MediaType.APPLICATION_JSON).content(withoutTitle));

    assertThat(result).hasStatus(HttpStatus.BAD_REQUEST);
  }

  @Test
  void reports_an_unknown_sort_field_as_a_bad_request() {
    var result = mvc.get().uri(PROJECTS + "?_sort=unknown").exchange();

    assertThat(result).hasStatus(HttpStatus.BAD_REQUEST);
  }

  private MvcTestResult authorized(MockMvcTester.MockMvcRequestBuilder request) {
    return request.header(AUTHORIZATION, token).exchange();
  }

  @SneakyThrows
  private static int idOf(MvcTestResult result) {
    return JsonPath.read(result.getResponse().getContentAsString(), "$.id");
  }
}
