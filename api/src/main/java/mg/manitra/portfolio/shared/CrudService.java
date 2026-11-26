package mg.manitra.portfolio.shared;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

public class CrudService<E extends PositionedEntity> {

  private final PositionedRepository<E> repository;

  public CrudService(PositionedRepository<E> repository) {
    this.repository = repository;
  }

  public Page<E> list(ListQuery query) {
    if (query.targetsSpecificIds()) {
      var found = repository.findAllById(query.ids());
      return new PageImpl<>(found);
    }
    return repository.findAll(query.toPageable());
  }

  public E get(long id) {
    return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
  }

  public E create(E entity) {
    entity.setId(null);
    return repository.save(entity);
  }

  public E update(long id, E changes) {
    ensureExists(id);
    changes.setId(id);
    return repository.save(changes);
  }

  public E delete(long id) {
    var deleted = get(id);
    repository.delete(deleted);
    return deleted;
  }

  private void ensureExists(long id) {
    if (!repository.existsById(id)) {
      throw new ResourceNotFoundException(id);
    }
  }
}
