package mg.manitra.portfolio.profile;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import mg.manitra.portfolio.shared.PositionedEntity;

@Entity
@Getter
@Setter
public class Interest extends PositionedEntity {
  @NotBlank
  private String label;

  private String emoji;
}
