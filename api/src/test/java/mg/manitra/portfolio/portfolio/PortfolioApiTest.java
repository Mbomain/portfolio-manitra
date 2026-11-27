package mg.manitra.portfolio.portfolio;

import static org.assertj.core.api.Assertions.assertThat;

import mg.manitra.portfolio.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@IntegrationTest
class PortfolioApiTest {

  @Autowired
  MockMvcTester mvc;

  @Test
  void serves_the_whole_portfolio_in_display_order() {
    var result = mvc.get().uri("/api/portfolio").exchange();

    assertThat(result).hasStatusOk();
    var json = assertThat(result).bodyJson();
    json.extractingPath("$.experiences[0].role").isEqualTo("Développeur Full-Stack");
    json.extractingPath("$.projects[0].links[*].label").asArray()
        .containsExactly("API sur GitHub", "Interface sur GitHub");
    json.extractingPath("$.keyFigures[*].value").asArray().containsExactly(3, 150, 6);
    json.extractingPath("$.languages[*].name").asArray().containsExactly("Malgache", "Français", "Anglais");
    json.extractingPath("$.skills.length()").isEqualTo(29);
  }
}
