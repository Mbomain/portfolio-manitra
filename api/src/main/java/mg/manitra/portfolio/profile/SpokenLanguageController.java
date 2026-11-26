package mg.manitra.portfolio.profile;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/languages")
public class SpokenLanguageController extends CrudController<SpokenLanguage> {

  public SpokenLanguageController(SpokenLanguageRepository repository) {
    super(repository);
  }
}
