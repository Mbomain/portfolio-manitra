package mg.manitra.portfolio.shared;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;

class ListQueryTest {

  @Test
  void turns_a_range_into_the_matching_page() {
    var pageable = new ListQuery(20, 30, "title", Sort.Direction.DESC, null).toPageable();

    assertThat(pageable.getPageNumber()).isEqualTo(2);
    assertThat(pageable.getPageSize()).isEqualTo(10);
    assertThat(pageable.getSort().getOrderFor("title").getDirection()).isEqualTo(Sort.Direction.DESC);
  }

  @Test
  void breaks_sort_ties_by_id_for_a_stable_order() {
    var pageable = new ListQuery(0, 10, "position", Sort.Direction.ASC, null).toPageable();

    assertThat(pageable.getSort().getOrderFor("id")).isNotNull();
  }

  @Test
  void caps_the_page_size() {
    var pageable = new ListQuery(0, 10_000, "position", Sort.Direction.ASC, null).toPageable();

    assertThat(pageable.getPageSize()).isEqualTo(ListQuery.MAX_PAGE_SIZE);
  }

  @Test
  void rejects_an_empty_or_negative_range() {
    assertThatIllegalArgumentException().isThrownBy(() -> new ListQuery(10, 10, "position", Sort.Direction.ASC, null));
    assertThatIllegalArgumentException().isThrownBy(() -> new ListQuery(-1, 10, "position", Sort.Direction.ASC, null));
  }

  @Test
  void knows_when_specific_ids_are_requested() {
    assertThat(new ListQuery(0, 10, "position", Sort.Direction.ASC, List.of(1L)).targetsSpecificIds()).isTrue();
    assertThat(new ListQuery(0, 10, "position", Sort.Direction.ASC, null).targetsSpecificIds()).isFalse();
  }
}
