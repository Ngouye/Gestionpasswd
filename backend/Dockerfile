# Étape 1 : Build
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests

# Étape 2 : Runtime
FROM eclipse-temurin:17-jre
WORKDIR /app
# On copie uniquement le jar principal (en excluant ceux commençant par 'original-')
COPY --from=build /app/target/gestion-mot-de-passe-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Xmx512m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]