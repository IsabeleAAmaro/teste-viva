
# Consultor de CEP e Gerenciador de Endereços

Aplicação web desenvolvida para permitir que um usuário insira seu CPF e CEP, obtenha automaticamente os dados de endereço via API da ViaCEP, salve essas informações em um banco de dados, liste, edite e delete os registros existentes.




## Stack utilizada

**Front-end:**
* **React 19**
* **Axios:** Cliente HTTP para fazer requisições à API do backend.

**Back-end:**
* **Java 17**
* **Spring Boot:** Framework para construção da API REST.
* **Spring Data JPA:** Para persistência de dados e interação com o banco de dados.
* **Lombok:** Biblioteca para reduzir código boilerplate (getters, setters, construtores).
* **`com.gtbr:via-cep`:** Biblioteca Java para consumo da API ViaCEP.
* **Apache Maven:** Ferramenta de automação de build e gerenciamento de dependências.

**Banco de Dados:**
* **PostgreSQL:** Banco de dados relacional para armazenamento dos dados.
## Demonstração

A aplicação pode ser utilizada no link: https://teste-viva-react.onrender.com/

* Backend API Base (Para Testes Diretos da API): https://teste-viva.onrender.com/api/enderecos


## Rodando localmente

Pré-requisitos

- Java Development Kit (JDK) 17 ou superior:

- Apache Maven 3.x ou superior:

- Node.js 14.x ou superior e npm

- PostgreSQL: Servidor de banco de dados instalado e rodando.


Clone o projeto

```bash
  git clone https://github.com/IsabeleAAmaro/teste-viva
```

### 1. Configuração do Banco de Dados PostgreSQL Local

2.  Crie um usuário e um banco de dados para a aplicação localmente.
    * Conecte-se como usuário `postgres`:
        ```bash
        sudo -u postgres psql
        ```
    * Dentro do prompt `psql`, execute os comandos (substitua `teste_user` e `[senha]` pelas credenciais do ambiente **local**):

        ```sql
        CREATE USER teste_user WITH PASSWORD '[senha]';
        CREATE DATABASE teste_endereco_db OWNER teste_user;
        GRANT ALL PRIVILEGES ON DATABASE teste_endereco_db TO teste_user;
        \q
        ```

### 2. Configuração e Execução do Backend

O backend será configurado para usar o banco de dados PostgreSQL local.

1.  Ajustar Configurações Locais:
    * Na pasta `TESTE-PRATICO/`, crie um arquivo chamado `application-local.properties` dentro de `src/main/resources/`.
    * Cole o seguinte conteúdo, utilizando as credenciais do seu PostgreSQL local:

        ```properties
        # Configurações do Banco de Dados PostgreSQL (para uso local)
        spring.datasource.url=jdbc:postgresql://localhost:5432/teste_endereco_db
        spring.datasource.username=teste_user
        spring.datasource.password=[senha]

        # Configurações do JPA/Hibernate para o perfil local
        spring.jpa.hibernate.ddl-auto=update
        spring.jpa.show-sql=true

        # Dialeto Hibernate para PostgreSQL (específico para o ambiente local)
        spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

        # CORS para desenvolvimento local (se o frontend estiver rodando localmente)
        spring.web.cors.allowed-origins=http://localhost:3000
        spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
        spring.web.cors.allowed-headers=*
        ```

2.  Instalar Dependências e Compilar o Backend:
    * Na pasta `TESTE-PRATICO/`, execute:
        ```bash
        mvn clean install
        ```

3.  Executar o Backend:
    * Ainda na pasta `TESTE-PRATICO/`, execute o comando para iniciar o backend, ativando o perfil `local`:
        ```bash
        mvn spring-boot:run -Dspring.profiles.active=local
        ```
    * O backend será iniciado na porta `8080`. Ele se conectará ao seu servidor PostgreSQL local.

### 3. Configuração e Execução do Frontend

1.  Ajustar Configurações Locais:
    * Na pasta `TESTE-PRATICO/frontend/`, crie ou edite o arquivo `.env`.
    * Cole o seguinte conteúdo:
        ```dotenv
        REACT_APP_API_BASE_URL=http://localhost:8080/api/enderecos
        ```

2.  Instalar Dependências do Frontend:
    * Na pasta `TESTE-PRATICO/frontend/`, execute:
        ```bash
        npm install
        ```

3.  Iniciar o Frontend:
    * Ainda na pasta `TESTE-PRATICO/frontend/`, execute:
        ```bash
        npm start
        ```

## Acessando a Aplicação Localmente

* **Frontend:** `http://localhost:3000`
* **Backend API Base:** `http://localhost:8080/api/enderecos`



## Documentação da API

Esta seção detalha os endpoints da API REST do backend. A base da URL da API é `https://teste-viva.onrender.com/api/enderecos` (ou `http://localhost:8080/api/enderecos` para uso local).

### Modelo de Dados (`Endereco`)

A API manipula objetos do tipo `Endereco` com a seguinte estrutura:

```json
{
  "id": Long,            
  "nome": String,        
  "cpf": String,         
  "cep": String,         
  "logradouro": String,
  "bairro": String,
  "cidade": String,
  "estado": String,
  "dataCriacao": String,
  "dataAtualizacao": String
}
```

### Resposta de Erro

Em caso de erros (`4xx` ou `5xx`), a API retornará um objeto JSON no seguinte formato:

```json
{
  "message": "Mensagem descritiva do erro",
  "status": 400
}
```

-----

### **1. Criar um Endereço**

Adiciona um novo registro de endereço e usuário. Os campos `logradouro`, `bairro`, `cidade` e `estado` são preenchidos automaticamente pelo backend via ViaCEP com base no `cep` fornecido.

```http
  POST /api/enderecos
  Content-Type: application/json
```

**Request Body:**

```json
{
  "nome": "Seu Nome",
  "cpf": "12345678901",
  "cep": "01001000"
}
```

**Exemplo de Resposta (Status 201 Created):**

```json
{
  "id": 1,
  "nome": "Seu Nome",
  "cpf": "12345678901",
  "cep": "01001000",
  "logradouro": "Praça da Sé",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "estado": "SP",
  "dataCriacao": "2025-07-30T15:00:00",
  "dataAtualizacao": "2025-07-30T15:00:00"
}
```

**Possíveis Códigos de Status:**

  * `201 Created`: Endereço criado com sucesso.
  * `400 Bad Request`:
      * CPF inválido ou em formato incorreto.
      * CPF já cadastrado.
      * CEP não encontrado ou inválido na ViaCEP.
      * Campos obrigatórios ausentes.
  * `500 Internal Server Error`: Erro inesperado no servidor ou falha na comunicação com a ViaCEP.

-----

### **2. Listar Todos os Endereços**

Retorna uma lista de todos os registros de endereço e usuário salvos.

```http
  GET /api/enderecos
```

**Exemplo de Resposta (Status 200 OK):**

```json
[
  {
    "id": 1,
    "nome": "Seu Nome",
    "cpf": "12345678901",
    "cep": "01001000",
    "logradouro": "Praça da Sé",
    "bairro": "Sé",
    "cidade": "São Paulo",
    "estado": "SP",
    "dataCriacao": "2025-07-30T15:00:00",
    "dataAtualizacao": "2025-07-30T15:00:00"
  },
  {
    "id": 2,
    "nome": "Outro Nome",
    "cpf": "98765432109",
    "cep": "20000000",
    "logradouro": "Rua do Teste",
    "bairro": "Centro",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "dataCriacao": "2025-07-30T15:05:00",
    "dataAtualizacao": "2025-07-30T15:05:00"
  }
]
```

**Possíveis Códigos de Status:**

  * `200 OK`: Requisição bem-sucedida. Retorna uma lista (que pode ser vazia).
  * `500 Internal Server Error`: Erro inesperado no servidor.

-----

### **3. Atualizar um Endereço Existente**

Atualiza os dados de um registro de endereço e usuário específico.

```http
  PUT /api/enderecos/${id}
  Content-Type: application/json
```

| Parâmetro | Tipo   | Descrição |
| :-------- | :----- | :---------------------------------------- |
| `id` | `Long` | **Obrigatório**. O ID do endereço a ser atualizado. |

**Request Body:**

```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "cpf": "11122233344",
  "cep": "05407001",
  "logradouro": "Rua da Consolação",
  "bairro": "Cerqueira César",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

**Exemplo de Resposta (Status 200 OK):**

```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "cpf": "11122233344",
  "cep": "05407001",
  "logradouro": "Rua da Consolação",
  "bairro": "Cerqueira César",
  "cidade": "São Paulo",
  "estado": "SP",
  "dataCriacao": "2025-07-30T15:00:00",
  "dataAtualizacao": "2025-07-30T16:00:00"
}
```

**Possíveis Códigos de Status:**

  * `200 OK`: Endereço atualizado com sucesso.
  * `400 Bad Request`:
      * ID na URL não corresponde ao ID no corpo.
      * CPF inválido, já cadastrado por outro usuário, ou em formato incorreto.
      * Novo CEP não encontrado ou inválido na ViaCEP.
      * Campos obrigatórios ausentes.
  * `404 Not Found`: Endereço com o ID fornecido não encontrado.
  * `500 Internal Server Error`: Erro inesperado no servidor ou falha na comunicação com a ViaCEP.

-----

### **4. Deletar um Endereço**

Remove um registro de endereço e usuário específico do banco de dados.

```http
  DELETE /api/enderecos/${id}
```

| Parâmetro | Tipo   | Descrição |
| :-------- | :----- | :---------------------------------------- |
| `id` | `Long` | **Obrigatório**. O ID do endereço a ser removido. |

**Exemplo de Resposta (Status 204 No Content):**

  * Não há corpo na resposta.

**Possíveis Códigos de Status:**

  * `204 No Content`: Endereço excluído com sucesso.
  * `404 Not Found`: Endereço com o ID fornecido não encontrado.
  * `500 Internal Server Error`: Erro inesperado no servidor.

-----
