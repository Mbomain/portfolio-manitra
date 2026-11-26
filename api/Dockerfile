# --- Build: compile and package the Spring Boot jar ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

COPY src src
# Tests run in CI and locally (they need Docker for Testcontainers), not inside the image build.
RUN ./mvnw -q -DskipTests package && cp target/portfolio-api-*.jar app.jar

# --- Run: a small JRE image, as a non-root user ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /workspace/app.jar app.jar
USER app

# Render's free instances have 512 MB of memory.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -Xss512k"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
