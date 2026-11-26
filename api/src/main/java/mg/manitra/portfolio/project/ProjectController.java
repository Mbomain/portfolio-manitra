package mg.manitra.portfolio.project;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController extends CrudController<Project> {

  public ProjectController(ProjectRepository repository) {
    super(repository);
  }
}
