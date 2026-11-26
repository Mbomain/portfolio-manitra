package mg.manitra.portfolio.shared;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(long id) {
    super("No resource with id " + id);
  }
}
