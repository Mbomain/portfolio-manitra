package mg.manitra.portfolio.profile;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import mg.manitra.portfolio.shared.PositionedEntity;

@Entity
@Getter
@Setter
public class KeyFigure extends PositionedEntity {
  @Min(0)
  private int value;

  private String suffix;

  @NotBlank
  private String label;
}
