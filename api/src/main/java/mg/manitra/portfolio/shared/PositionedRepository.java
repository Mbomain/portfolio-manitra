package mg.manitra.portfolio.shared;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PositionedRepository<E extends PositionedEntity> extends JpaRepository<E, Long> {

  Sort BY_POSITION = Sort.by("position", "id");

  default List<E> findAllInDisplayOrder() {
    return findAll(BY_POSITION);
  }
}
