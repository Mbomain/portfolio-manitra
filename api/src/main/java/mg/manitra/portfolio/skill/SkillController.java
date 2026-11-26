package mg.manitra.portfolio.skill;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skills")
public class SkillController extends CrudController<Skill> {

  public SkillController(SkillRepository repository) {
    super(repository);
  }
}
