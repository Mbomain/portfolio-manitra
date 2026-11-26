package mg.manitra.portfolio.education;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import mg.manitra.portfolio.shared.PositionedEntity;

@Entity
@Getter
@Setter
public class Education extends PositionedEntity {
  @NotBlank
  private String degree;

  @NotBlank
  private String school;

  @NotBlank
  private String period;

  private String description;
}
