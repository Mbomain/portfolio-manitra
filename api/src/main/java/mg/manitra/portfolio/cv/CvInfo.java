package mg.manitra.portfolio.cv;

import java.time.Instant;

/** What the back office shows about the current CV, without its content. */
public record CvInfo(String fileName, long size, Instant updatedAt) {}
