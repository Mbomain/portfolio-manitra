package mg.manitra.portfolio.profile;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import mg.manitra.portfolio.shared.PositionedEntity;

@Entity
@Getter
@Setter
public class SpokenLanguage extends PositionedEntity {
  @NotBlank
  private String name;

  @NotBlank
  private String level;

  @Min(0)
  @Max(100)
  private int proficiency;
}
