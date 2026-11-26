package mg.manitra.portfolio.profile;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interests")
public class InterestController extends CrudController<Interest> {

  public InterestController(InterestRepository repository) {
    super(repository);
  }
}
