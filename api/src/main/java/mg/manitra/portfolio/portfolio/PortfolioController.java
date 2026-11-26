package mg.manitra.portfolio.portfolio;

import lombok.RequiredArgsConstructor;
import mg.manitra.portfolio.education.EducationRepository;
import mg.manitra.portfolio.experience.ExperienceRepository;
import mg.manitra.portfolio.profile.DrivingLicenseRepository;
import mg.manitra.portfolio.profile.InterestRepository;
import mg.manitra.portfolio.profile.KeyFigureRepository;
import mg.manitra.portfolio.profile.SpokenLanguageRepository;
import mg.manitra.portfolio.project.ProjectRepository;
import mg.manitra.portfolio.skill.SkillRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PortfolioController {

  private final KeyFigureRepository keyFigures;
  private final ExperienceRepository experiences;
  private final ProjectRepository projects;
  private final SkillRepository skills;
  private final EducationRepository educations;
  private final SpokenLanguageRepository languages;
  private final InterestRepository interests;
  private final DrivingLicenseRepository licenses;

  @GetMapping("/api/portfolio")
  @Transactional(readOnly = true)
  public PortfolioContent getPortfolio() {
    return new PortfolioContent(
        keyFigures.findAllInDisplayOrder(),
        experiences.findAllInDisplayOrder(),
        projects.findAllInDisplayOrder(),
        skills.findAllInDisplayOrder(),
        educations.findAllInDisplayOrder(),
        languages.findAllInDisplayOrder(),
        interests.findAllInDisplayOrder(),
        licenses.findAllInDisplayOrder());
  }
}
