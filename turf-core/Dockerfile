# Use Maven with OpenJDK 17 as the base image (using latest Maven 3.8 LTS)
FROM maven:3.8-openjdk-17-slim as build

# Set working directory
WORKDIR /app

# Copy pom.xml first for better Docker layer caching
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage - use Eclipse Temurin JRE for better memory efficiency
FROM eclipse-temurin:17-jre-jammy

# Set working directory
WORKDIR /app

# Install curl for health checks and clean up in same layer to reduce image size
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy the jar file from build stage
COPY --from=build /app/target/turf-booking-*.jar app.jar

# Change ownership of the app directory
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose the port the app runs on
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Ultra-minimal JVM settings - no experimental flags
ENV JAVA_OPTS="-Xmx280m -Xms64m"

# Set production profile
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application with hardcoded safe JVM options
ENTRYPOINT ["java", "-Xmx280m", "-Xms64m", "-Dspring.profiles.active=prod", "-jar", "app.jar"]