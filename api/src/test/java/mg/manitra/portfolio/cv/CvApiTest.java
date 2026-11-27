package mg.manitra.portfolio.cv;

import static java.nio.charset.StandardCharsets.US_ASCII;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import mg.manitra.portfolio.AdminSession;
import mg.manitra.portfolio.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@Transactional
class CvApiTest {

  private static final byte[] PDF = "%PDF-1.7 a tiny test document".getBytes(US_ASCII);

  @Autowired
  MockMvcTester mvc;

  @Autowired
  AdminSession admin;

  @Test
  void reports_that_no_cv_was_uploaded_yet() {
    assertThat(mvc.get().uri(CvController.PATH).exchange()).hasStatus(HttpStatus.NOT_FOUND);
    assertThat(mvc.get().uri(CvController.PATH + "/info").exchange()).hasStatus(HttpStatus.NOT_FOUND);
    assertThat(mvc.get().uri("/api/portfolio").exchange()).bodyJson().extractingPath("$.cv").isNull();
  }

  @Test
  void refuses_an_upload_without_a_token() {
    var result = mvc.put().uri(CvController.PATH).multipart().file(pdf("CV.pdf", PDF)).exchange();

    assertThat(result).hasStatus(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void serves_the_uploaded_cv_to_everyone() {
    var uploaded = upload(pdf("C:\\Users\\me\\CV-corrige.pdf", PDF));
    assertThat(uploaded).hasStatusOk();
    assertThat(uploaded).bodyJson().extractingPath("$.fileName").isEqualTo("CV-corrige.pdf");
    assertThat(uploaded).bodyJson().extractingPath("$.size").isEqualTo(PDF.length);

    var downloaded = mvc.get().uri(CvController.PATH).exchange();
    assertThat(downloaded).hasStatusOk().hasContentType(MediaType.APPLICATION_PDF);
    assertThat(downloaded).hasHeader("Content-Disposition",
        "attachment; filename=\"" + CvController.DOWNLOAD_NAME + "\"");
    assertThat(downloaded.getResponse().getContentAsByteArray()).isEqualTo(PDF);

    var portfolio = mvc.get().uri("/api/portfolio").exchange();
    assertThat(portfolio).bodyJson().extractingPath("$.cv.fileName").isEqualTo("CV-corrige.pdf");
  }

  @Test
  void replaces_the_previous_cv() {
    upload(pdf("ancien.pdf", PDF));
    var newer = "%PDF-1.7 the corrected version".getBytes(US_ASCII);

    upload(pdf("nouveau.pdf", newer));

    assertThat(mvc.get().uri(CvController.PATH + "/info").exchange()).bodyJson()
        .extractingPath("$.fileName").isEqualTo("nouveau.pdf");
    assertThat(mvc.get().uri(CvController.PATH).exchange().getResponse().getContentAsByteArray()).isEqualTo(newer);
  }

  @Test
  void rejects_a_file_that_is_not_a_pdf() {
    var result = upload(pdf("CV.pdf", "<html>not a pdf</html>".getBytes(US_ASCII)));

    assertThat(result).hasStatus(HttpStatus.BAD_REQUEST);
  }

  private MvcTestResult upload(MockMultipartFile file) {
    return mvc.put().uri(CvController.PATH).multipart().file(file).header(AUTHORIZATION, admin.bearerToken()).exchange();
  }

  private static MockMultipartFile pdf(String name, byte[] content) {
    return new MockMultipartFile("file", name, MediaType.APPLICATION_PDF_VALUE, content);
  }
}
