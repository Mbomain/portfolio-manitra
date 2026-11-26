package mg.manitra.portfolio.shared;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * REST endpoints following the json-server conventions expected by react-admin.
 * Subclasses only declare their route and their repository.
 */
public abstract class CrudController<E extends PositionedEntity> {

  public static final String TOTAL_COUNT_HEADER = "X-Total-Count";

  private final CrudService<E> service;

  protected CrudController(PositionedRepository<E> repository) {
    this.service = new CrudService<>(repository);
  }

  @GetMapping
  public ResponseEntity<List<E>> list(
      @RequestParam(name = "_start", defaultValue = "0") int start,
      @RequestParam(name = "_end", defaultValue = "100") int end,
      @RequestParam(name = "_sort", defaultValue = "position") String sortField,
      @RequestParam(name = "_order", defaultValue = "ASC") Sort.Direction direction,
      @RequestParam(name = "id", required = false) List<Long> ids) {
    var page = service.list(new ListQuery(start, end, sortField, direction, ids));
    return ResponseEntity.ok()
        .header(TOTAL_COUNT_HEADER, String.valueOf(page.getTotalElements()))
        .body(page.getContent());
  }

  @GetMapping("/{id}")
  public E get(@PathVariable long id) {
    return service.get(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public E create(@Valid @RequestBody E entity) {
    return service.create(entity);
  }

  @PutMapping("/{id}")
  public E update(@PathVariable long id, @Valid @RequestBody E changes) {
    return service.update(id, changes);
  }

  /** Returns the deleted resource, as react-admin expects. */
  @DeleteMapping("/{id}")
  public E delete(@PathVariable long id) {
    return service.delete(id);
  }
}
