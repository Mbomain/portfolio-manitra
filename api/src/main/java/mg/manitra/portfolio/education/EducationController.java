package mg.manitra.portfolio.education;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/educations")
public class EducationController extends CrudController<Education> {

  public EducationController(EducationRepository repository) {
    super(repository);
  }
}
