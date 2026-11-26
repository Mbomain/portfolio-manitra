package mg.manitra.portfolio.project;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

@Embeddable
public record ProjectLink(@NotBlank String label, @NotBlank @URL String url) {}
