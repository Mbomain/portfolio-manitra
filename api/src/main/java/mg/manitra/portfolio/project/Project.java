package mg.manitra.portfolio.project;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.validation.Valid;
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
public class Project extends PositionedEntity {
  @NotBlank
  private String title;

  @NotBlank
  private String category;

  @NotBlank
  private String period;

  @NotBlank
  private String summary;

  /** Light markdown: "## " headings, "- " bullet items, **bold** and plain paragraphs. */
  @Column(columnDefinition = "text")
  private String details;

  private boolean featured;

  @JdbcTypeCode(SqlTypes.ARRAY)
  @Column(columnDefinition = "text[]")
  private List<String> technologies = new ArrayList<>();

  @Valid
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "project_link", joinColumns = @JoinColumn(name = "project_id"))
  @OrderColumn(name = "position")
  private List<ProjectLink> links = new ArrayList<>();
}
