FROM maven:3.9.6-openjdk-17-slim

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo pom.xml para que o Maven possa baixar as dependências
# antes de copiar todo o código-fonte, aproveitando o cache do Docker.
COPY pom.xml .

# Baixar as dependências do Maven (sem compilar o código ainda)
RUN mvn dependency:go-offline -B

# Copiar o restante do código-fonte da aplicação
COPY src ./src

# Buildar a aplicação Spring Boot em um JAR executável
# -DskipTests: Pula a execução dos testes para um build mais rápido no deploy.
RUN mvn package -Dmaven.test.skip=true

# Expor a porta em que sua aplicação Spring Boot vai rodar
EXPOSE 8080

# Comando para rodar a aplicação Spring Boot quando o contêiner iniciar
# O Render injeta a porta real via variável de ambiente $PORT
ENTRYPOINT ["java", "-jar", "target/teste-pratico-0.0.1-SNAPSHOT.jar"]