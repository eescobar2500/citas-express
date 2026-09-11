# Curso Express.js

API REST desarrollada con **Node.js** y **Express.js** como proyecto práctico para aprender y aplicar conceptos fundamentales del desarrollo backend.

El proyecto evoluciona progresivamente incorporando routing, middlewares, validaciones, variables de entorno, manejo de errores, logging, persistencia de datos, PostgreSQL, Prisma, migraciones, seeds y separación de responsabilidades.

---

## 📚 Objetivos del proyecto

Este proyecto tiene como objetivo comprender los fundamentos del desarrollo backend utilizando Node.js y Express.js.

Durante su desarrollo se trabajan conceptos como:

* Node.js
* Express.js
* Servidores HTTP
* APIs REST
* Métodos HTTP
* Routing
* Request y Response
* Middleware
* Middleware personalizado
* Manejo centralizado de errores
* Logging
* Validación de datos
* Variables de entorno
* `process.env`
* Persistencia de información
* Operaciones CRUD
* Módulos ES (`import` / `export`)
* `async` / `await`
* Manejo de excepciones
* Gestión de dependencias con pnpm
* PostgreSQL
* Docker
* Prisma ORM
* Prisma Client
* Migraciones
* Seeds
* Relaciones entre modelos
* Enums
* Organización y separación de responsabilidades

---

# 🛠️ Tecnologías utilizadas

### Node.js

Entorno de ejecución de JavaScript utilizado para ejecutar el backend.

### Express.js

Framework utilizado para construir el servidor HTTP y desarrollar la API REST.

### PostgreSQL

Sistema de gestión de bases de datos relacional utilizado para almacenar la información de la aplicación.

### Docker

Utilizado para ejecutar PostgreSQL dentro de un contenedor sin necesidad de instalar y administrar PostgreSQL directamente en el sistema operativo.

### Prisma

ORM utilizado para trabajar con PostgreSQL desde Node.js.

Permite definir los modelos de datos, crear migraciones y generar Prisma Client.

### pnpm

Gestor de paquetes utilizado para instalar y administrar las dependencias del proyecto.

### dotenv

Utilizado para cargar variables de entorno desde archivos `.env`.

---

# 📋 Requisitos

Antes de ejecutar el proyecto necesitas tener instalado:

* Node.js
* pnpm
* Docker
* Git

Puedes comprobar las versiones instaladas con:

```bash
node --version
pnpm --version
docker --version
git --version
```

---

# 🚀 Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd curso-express-js
```

Instalar las dependencias:

```bash
pnpm install
```

---

# ⚙️ Variables de entorno

El proyecto utiliza variables de entorno para almacenar configuraciones que pueden cambiar dependiendo del entorno.

Crear un archivo:

```text
.env
```

Puedes utilizar `.env.example` como referencia.

Ejemplo:

```env
PORT=3002
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/curso_express"
```

### Variables utilizadas

| Variable       | Descripción                         |
| -------------- | ----------------------------------- |
| `PORT`         | Puerto donde se ejecuta el servidor |
| `NODE_ENV`     | Entorno de ejecución                |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL     |

> El archivo `.env` no debe subirse al repositorio porque puede contener información sensible.

---

# 🐘 PostgreSQL con Docker

El proyecto utiliza Docker Compose para ejecutar PostgreSQL.

## Iniciar PostgreSQL

```bash
docker compose up -d
```

El parámetro `-d` ejecuta el contenedor en segundo plano.

## Ver contenedores activos

```bash
docker ps
```

## Detener PostgreSQL

```bash
docker compose down
```

## Ver los logs del contenedor

```bash
docker compose logs postgres
```

El proyecto utiliza:

```text
Database: curso_express
User: postgres
Port: 5432
```

---

# 🗄️ Prisma

Prisma se utiliza como ORM para comunicarse con PostgreSQL.

La configuración principal se encuentra en:

```text
prisma/
├── schema.prisma
└── migrations/
```

Además, la configuración de Prisma se encuentra en:

```text
prisma.config.ts
```

La conexión de Prisma con PostgreSQL se configura en:

```text
database/prisma.js
```

---

# 🔄 Migraciones

Las migraciones permiten mantener sincronizada la estructura de la base de datos con el `schema.prisma`.

## Crear una migración

Después de modificar:

```text
prisma/schema.prisma
```

ejecutar:

```bash
pnpm prisma migrate dev --name nombre-de-la-migracion
```

Por ejemplo:

```bash
pnpm prisma migrate dev --name add-user-role
```

Una migración puede ser necesaria cuando:

* Se agrega un modelo.
* Se elimina un modelo.
* Se agrega un campo.
* Se elimina un campo.
* Se modifica un tipo.
* Se agrega una relación.
* Se agrega un `enum`.
* Se modifica la estructura de una tabla.

### Ver estado de las migraciones

```bash
pnpm prisma migrate status
```

Si todo está sincronizado aparecerá:

```text
Database schema is up to date!
```

---

# 🧬 Prisma Client

Después de modificar el schema también podemos regenerar Prisma Client:

```bash
pnpm prisma generate
```

Esto genera el cliente utilizado desde Node.js.

En este proyecto se genera dentro de:

```text
src/generated/prisma/
```

---

# ✅ Validar el schema

Para comprobar que el `schema.prisma` es válido:

```bash
pnpm prisma validate
```

---

# 🌱 Seeds

Los seeds permiten insertar datos iniciales o datos de prueba en la base de datos.

Por ejemplo, el proyecto contiene seeds para usuarios y publicaciones.

Los seeds se encuentran dentro de:

```text
database/seed/
```

Para ejecutar un seed:

```bash
node database/seed/seedUser.js
```

Por ejemplo, un seed puede crear usuarios:

```js
await prisma.user.createMany({
  data: [
    {
      name: "Erick",
      email: "erick@example.com",
      password: "123456",
      role: "ADMIN"
    },
    {
      name: "Juan",
      email: "juan@example.com",
      password: "123456",
      role: "USER"
    }
  ]
});
```

### Diferencia entre migraciones y seeds

**Migración:**

Define o modifica la estructura de la base de datos.

```text
Crear tabla User
Agregar campo role
Crear tabla Post
```

**Seed:**

Inserta datos.

```text
Crear usuario Erick
Crear usuario Juan
Crear publicaciones
```

---

# 👤 Modelo User

El modelo `User` contiene información de los usuarios:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
  role     Role
  posts    Post[]
}
```

El usuario también tiene un rol definido mediante un `enum`:

```prisma
enum Role {
  ADMIN
  USER
}
```

Por lo tanto, los valores permitidos son:

```text
ADMIN
USER
```

---

# 📝 Modelo Post

Las publicaciones pertenecen a un usuario:

```prisma
model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
  userId  Int
  user    User    @relation(fields: [userId], references: [id])
}
```

La relación entre `User` y `Post` es:

```text
User
 │
 └── posts
      ├── Post
      ├── Post
      └── Post
```

Un usuario puede tener muchas publicaciones.

---

# ▶️ Ejecutar el proyecto

Para ejecutar el servidor en modo desarrollo:

```bash
pnpm dev
```

El proyecto utiliza el script:

```json
"dev": "node --watch app.js"
```

Esto permite reiniciar automáticamente el servidor cuando se detectan cambios.

Para ejecutar el proyecto normalmente:

```bash
pnpm start
```

---

# 🧪 Pruebas de conexión

Para comprobar la conexión entre Prisma y PostgreSQL:

```bash
node database/test.js
```

También existen archivos de prueba para comprobar funcionalidades específicas de Prisma.

Por ejemplo:

```bash
node database/testRole.js
```

---

# 📁 Estructura del proyecto

```text
curso-express-js/
│
├── database/
│   ├── prisma.js
│   ├── seed/
│   │   ├── seedUser.js
│   │   └── seedPost.js
│   ├── test.js
│   └── testRole.js
│
├── middleware/
│   ├── errorHandle.js
│   └── logger.js
│
├── services/
│
├── src/
│   └── generated/
│       └── prisma/
│
├── validations/
│   └── userValidation.js
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
└── README.md
```

---

# 📌 Comandos básicos

## Node.js

Ejecutar un archivo:

```bash
node archivo.js
```

Ver versión:

```bash
node --version
```

---

## pnpm

Instalar dependencias:

```bash
pnpm install
```

Instalar una dependencia:

```bash
pnpm add nombre-paquete
```

Instalar una dependencia de desarrollo:

```bash
pnpm add -D nombre-paquete
```

Ejecutar un script:

```bash
pnpm dev
```

---

## Docker

Iniciar servicios:

```bash
docker compose up -d
```

Detener servicios:

```bash
docker compose down
```

Ver contenedores:

```bash
docker ps
```

Ver logs:

```bash
docker compose logs
```

---

## Prisma

Validar schema:

```bash
pnpm prisma validate
```

Crear migración:

```bash
pnpm prisma migrate dev --name nombre
```

Ver estado:

```bash
pnpm prisma migrate status
```

Generar Prisma Client:

```bash
pnpm prisma generate
```

---

# 🔀 Git

Ver estado del repositorio:

```bash
git status
```

Agregar archivos:

```bash
git add .
```

Crear un commit:

```bash
git commit -m "feat: integrate PostgreSQL and Prisma"
```

Ver historial:

```bash
git log --oneline
```

Subir cambios:

```bash
git push origin main
```

---

# 🧹 Archivos que no deben subirse

El archivo:

```text
.env
```

debe mantenerse fuera del repositorio.

También se excluyen archivos y directorios generados o específicos de herramientas cuando no forman parte del código compartido:

```text
node_modules/
.env
.agents/
.claude/
.cursor/
.devin/
```

En cambio:

```text
.env.example
```

sí debe formar parte del repositorio para mostrar qué variables de entorno necesita el proyecto.

---

# 🧠 Conceptos aprendidos

Este proyecto se desarrolla progresivamente para comprender cómo construir una API REST desde cero.

Los principales conceptos trabajados son:

### Backend

* Node.js
* Express.js
* HTTP
* APIs REST
* Request
* Response
* Routing
* CRUD

### Arquitectura

* Separación de responsabilidades
* Services
* Middleware
* Validaciones
* Manejo centralizado de errores

### Base de datos

* PostgreSQL
* SQL
* Relaciones
* Primary Keys
* Foreign Keys
* Constraints
* Enums

### Prisma

* Prisma Schema
* Prisma Client
* Migrations
* Seeds
* Relaciones entre modelos
* Conexión mediante PostgreSQL

### Entorno

* Variables de entorno
* `.env`
* `.env.example`
* Docker
* Docker Compose
* pnpm

### JavaScript

* ES Modules
* `import`
* `export`
* `async`
* `await`
* Promises
* Manejo de excepciones

---

# 📈 Evolución del proyecto

El proyecto se construye de manera progresiva.

La evolución general es:

```text
Node.js
   ↓
Express.js
   ↓
Servidor HTTP
   ↓
Routing
   ↓
Middleware
   ↓
Validaciones
   ↓
Manejo de errores
   ↓
Variables de entorno
   ↓
Persistencia
   ↓
PostgreSQL
   ↓
Docker
   ↓
Prisma
   ↓
Migraciones
   ↓
Seeds
   ↓
Relaciones
   ↓
Separación de responsabilidades
```

El objetivo no es únicamente construir una API funcional, sino comprender **qué problema resuelve cada herramienta y por qué se incorpora al proyecto**.

---

# 📚 Estado actual

Actualmente el proyecto cuenta con:

* API desarrollada con Express.js.
* Variables de entorno mediante `dotenv`.
* PostgreSQL ejecutándose mediante Docker.
* Prisma como ORM.
* Prisma Client generado.
* Migraciones.
* Modelo `User`.
* Modelo `Post`.
* Relación entre usuarios y publicaciones.
* Roles mediante `enum`.
* Seeds para datos iniciales.
* Validaciones.
* Middleware personalizado.
* Manejo centralizado de errores.
* Logging.
* Separación de responsabilidades.

---

# 👨‍💻 Autor

Proyecto desarrollado como parte del proceso de aprendizaje de desarrollo backend con Node.js, Express.js, PostgreSQL y Prisma.
