package mg.manitra.portfolio.shared;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * A list request as sent by react-admin's json-server data provider:
 * {@code ?_start=0&_end=10&_sort=title&_order=ASC&id=1&id=2}.
 */
public record ListQuery(int start, int end, String sortField, Sort.Direction direction, List<Long> ids) {

  public static final int MAX_PAGE_SIZE = 100;

  public ListQuery {
    if (start < 0 || end <= start) {
      throw new IllegalArgumentException("Invalid range: _start=" + start + ", _end=" + end);
    }
    ids = ids == null ? List.of() : List.copyOf(ids);
  }

  public boolean targetsSpecificIds() {
    return !ids.isEmpty();
  }

  public Pageable toPageable() {
    var size = Math.min(end - start, MAX_PAGE_SIZE);
    return PageRequest.of(start / size, size, Sort.by(direction, sortField).and(Sort.by("id")));
  }
}
