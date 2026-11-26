package mg.manitra.portfolio.profile;

import mg.manitra.portfolio.shared.CrudController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/licenses")
public class DrivingLicenseController extends CrudController<DrivingLicense> {

  public DrivingLicenseController(DrivingLicenseRepository repository) {
    super(repository);
  }
}
