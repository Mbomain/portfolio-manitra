package mg.manitra.portfolio.shared;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import mg.manitra.portfolio.profile.Interest;
import mg.manitra.portfolio.profile.InterestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CrudServiceTest {

  @Mock
  InterestRepository repository;

  @InjectMocks
  CrudService<Interest> service;

  @Test
  void ignores_any_client_supplied_id_on_creation() {
    var interest = interest("Musique");
    interest.setId(42L);
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    var created = service.create(interest);

    assertThat(created.getId()).isNull();
  }

  @Test
  void updates_the_resource_found_at_the_given_id() {
    when(repository.existsById(7L)).thenReturn(true);
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    var updated = service.update(7L, interest("Natation"));

    assertThat(updated.getId()).isEqualTo(7L);
  }

  @Test
  void refuses_to_update_an_unknown_resource() {
    when(repository.existsById(7L)).thenReturn(false);

    assertThatThrownBy(() -> service.update(7L, interest("Natation"))).isInstanceOf(ResourceNotFoundException.class);
    verify(repository, never()).save(any());
  }

  @Test
  void reports_a_missing_resource() {
    when(repository.findById(3L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> service.get(3L)).isInstanceOf(ResourceNotFoundException.class);
  }

  private static Interest interest(String label) {
    var interest = new Interest();
    interest.setLabel(label);
    return interest;
  }
}
