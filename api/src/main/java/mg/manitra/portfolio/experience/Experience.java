package mg.manitra.portfolio.experience;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import mg.manitra.portfolio.shared.PositionedEntity;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
public class Experience extends PositionedEntity {
  @NotBlank
  private String role;

  @NotBlank
  private String organization;

  @NotBlank
  private String period;

  private String tag;

  private String summary;

  @JdbcTypeCode(SqlTypes.ARRAY)
  @Column(columnDefinition = "text[]")
  private List<String> highlights = new ArrayList<>();

  @JdbcTypeCode(SqlTypes.ARRAY)
  @Column(columnDefinition = "text[]")
  private List<String> technologies = new ArrayList<>();
}
