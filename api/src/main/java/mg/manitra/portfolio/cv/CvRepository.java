package mg.manitra.portfolio.cv;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** The CV table holds at most one row. */
@Repository
@RequiredArgsConstructor
public class CvRepository {

  private final JdbcClient jdbc;

  public Optional<CvInfo> findInfo() {
    return jdbc.sql("select file_name, octet_length(content) as size, updated_at from cv")
        .query((row, rowNumber) -> new CvInfo(
            row.getString("file_name"),
            row.getLong("size"),
            row.getTimestamp("updated_at").toInstant()))
        .optional();
  }

  public Optional<byte[]> findContent() {
    return jdbc.sql("select content from cv").query((row, rowNumber) -> row.getBytes("content")).optional();
  }

  @Transactional
  public CvInfo replace(String fileName, byte[] content) {
    jdbc.sql("""
            insert into cv (id, file_name, content, updated_at) values (1, :fileName, :content, now())
            on conflict (id) do update
            set file_name = excluded.file_name, content = excluded.content, updated_at = excluded.updated_at""")
        .param("fileName", fileName)
        .param("content", content)
        .update();
    return findInfo().orElseThrow();
  }
}
