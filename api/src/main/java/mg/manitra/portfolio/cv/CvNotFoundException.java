package mg.manitra.portfolio.cv;

public class CvNotFoundException extends RuntimeException {

  public CvNotFoundException() {
    super("No CV has been uploaded yet");
  }
}
