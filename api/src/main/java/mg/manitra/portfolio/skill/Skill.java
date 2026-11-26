package mg.manitra.portfolio.skill;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import mg.manitra.portfolio.shared.PositionedEntity;

@Entity
@Getter
@Setter
public class Skill extends PositionedEntity {
  @NotBlank
  private String name;

  /** Group shown on the site (e.g. "Langages"); skills without a category only appear in the levels. */
  private String category;

  @Enumerated(EnumType.STRING)
  private SkillLevel level;
}
