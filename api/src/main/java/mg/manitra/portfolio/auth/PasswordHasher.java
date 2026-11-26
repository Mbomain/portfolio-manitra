package mg.manitra.portfolio.auth;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Prints the value to use for ADMIN_PASSWORD_HASH. The password is typed at a prompt,
 * so it never lands in the shell history.
 *
 * <pre>.\mvnw -q compile exec:java "-Dexec.mainClass=mg.manitra.portfolio.auth.PasswordHasher"</pre>
 */
public final class PasswordHasher {

  private static final int MIN_LENGTH = 12;

  private PasswordHasher() {}

  public static void main(String[] args) throws IOException {
    var password = readPassword();
    if (password.length() < MIN_LENGTH) {
      System.err.println("Choose at least " + MIN_LENGTH + " characters.");
      System.exit(1);
    }
    System.out.println("{bcrypt}" + new BCryptPasswordEncoder().encode(password));
  }

  private static String readPassword() throws IOException {
    var console = System.console();
    if (console != null) {
      return new String(console.readPassword("Admin password: "));
    }
    System.out.print("Admin password: ");
    return new BufferedReader(new InputStreamReader(System.in)).readLine();
  }
}
