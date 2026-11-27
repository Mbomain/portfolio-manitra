package mg.manitra.portfolio.portfolio;

import java.util.List;
import mg.manitra.portfolio.cv.CvInfo;
import mg.manitra.portfolio.education.Education;
import mg.manitra.portfolio.experience.Experience;
import mg.manitra.portfolio.profile.DrivingLicense;
import mg.manitra.portfolio.profile.Interest;
import mg.manitra.portfolio.profile.KeyFigure;
import mg.manitra.portfolio.profile.SpokenLanguage;
import mg.manitra.portfolio.project.Project;
import mg.manitra.portfolio.skill.Skill;

/** Everything the public site displays, in display order, in a single payload. {@code cv} is null until one is uploaded. */
public record PortfolioContent(
    List<KeyFigure> keyFigures,
    List<Experience> experiences,
    List<Project> projects,
    List<Skill> skills,
    List<Education> educations,
    List<SpokenLanguage> languages,
    List<Interest> interests,
    List<DrivingLicense> licenses,
    CvInfo cv) {}
