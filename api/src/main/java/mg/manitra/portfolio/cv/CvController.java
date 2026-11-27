package mg.manitra.portfolio.cv;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(CvController.PATH)
@RequiredArgsConstructor
public class CvController {

  public static final String PATH = "/api/cv";
  /** Visitors always download the CV under this name, whatever the uploaded file was called. */
  public static final String DOWNLOAD_NAME = "CV-Manitra-Andriamparanimahefa.pdf";

  private static final byte[] PDF_SIGNATURE = "%PDF-".getBytes(StandardCharsets.US_ASCII);

  private final CvRepository cvs;

  @GetMapping(produces = MediaType.APPLICATION_PDF_VALUE)
  public ResponseEntity<byte[]> download() {
    var content = cvs.findContent().orElseThrow(CvNotFoundException::new);
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header("Content-Disposition", ContentDisposition.attachment().filename(DOWNLOAD_NAME).build().toString())
        .cacheControl(CacheControl.noCache())
        .body(content);
  }

  @GetMapping("/info")
  public CvInfo info() {
    return cvs.findInfo().orElseThrow(CvNotFoundException::new);
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public CvInfo replace(@RequestPart("file") MultipartFile file) throws IOException {
    var content = file.getBytes();
    if (!isPdf(content)) {
      throw new IllegalArgumentException("The CV must be a PDF file");
    }
    return cvs.replace(fileNameOf(file), content);
  }

  private static boolean isPdf(byte[] content) {
    return content.length > PDF_SIGNATURE.length
        && Arrays.equals(content, 0, PDF_SIGNATURE.length, PDF_SIGNATURE, 0, PDF_SIGNATURE.length);
  }

  /** The uploaded name without any folder a browser might have sent along. */
  private static String fileNameOf(MultipartFile file) {
    var original = file.getOriginalFilename();
    if (original == null || original.isBlank()) {
      return DOWNLOAD_NAME;
    }
    return original.substring(Math.max(original.lastIndexOf('/'), original.lastIndexOf('\\')) + 1);
  }
}
