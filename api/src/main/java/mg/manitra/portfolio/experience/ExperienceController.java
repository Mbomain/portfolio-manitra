package mg.manitra.portfolio.experience;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController extends CrudController<Experience> {

  public ExperienceController(ExperienceRepository repository) {
    super(repository);
  }
}
