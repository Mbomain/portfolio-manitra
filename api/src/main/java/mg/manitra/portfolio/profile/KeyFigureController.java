package mg.manitra.portfolio.profile;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/key-figures")
public class KeyFigureController extends CrudController<KeyFigure> {

  public KeyFigureController(KeyFigureRepository repository) {
    super(repository);
  }
}
