FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app

COPY . .

RUN mvn clean install

FROM amazoncorretto:21.0.2

COPY --from=builder /app/target/*.jar /app/my-app.jar

WORKDIR /app

ENTRYPOINT ["java", "-jar", "/app/my-app.jar"]