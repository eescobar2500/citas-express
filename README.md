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

### Railway

Plataforma utilizada para desplegar el desarrollo en la nube y alojar una base de datos PostgreSQL accesible desde internet.

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

# 🚂 Railway

Además de la base local en Docker, el proyecto utiliza **Railway** para desplegar el desarrollo en la nube.

Railway es una plataforma que permite alojar aplicaciones y bases de datos sin configurar un servidor manualmente. En este proyecto se usa para tener una base **PostgreSQL accesible desde internet**, de modo que la API no dependa únicamente del contenedor local.

## Los dos entornos

El proyecto puede apuntar a cualquiera de las dos bases. La única diferencia es el valor de `DATABASE_URL`:

| Entorno     | Dónde vive             | Cuándo usarlo                                 |
| ----------- | ---------------------- | --------------------------------------------- |
| **Local**   | Docker (`compose.yml`) | Desarrollo diario, pruebas rápidas            |
| **Railway** | Nube                   | Datos compartidos, probar el entorno desplegado |

> Mantener una sola `DATABASE_URL` activa en el `.env`.
> Si el archivo tiene la variable **repetida**, `dotenv` se queda con **la primera** y descarta el resto, por lo que la app puede terminar conectada a una base distinta de la esperada.

Para alternar entre entornos, comentar la que no se use:

```env
# Local
#DATABASE_URL="postgresql://postgres:postgres@localhost:5432/curso_express"

# Railway
DATABASE_URL="postgresql://postgres:CONTRASEÑA@HOST:PUERTO/railway?sslmode=require"
```

## Conectarse a Railway

La cadena de conexión se obtiene desde el panel de Railway, en el servicio de PostgreSQL, dentro de la pestaña de variables (`DATABASE_URL` o `DATABASE_PUBLIC_URL`).

También puede levantarse un proxy local con la CLI de Railway:

```bash
railway login
railway link
railway connect postgres
```

Esto expone la base remota en una dirección local (por ejemplo `127.0.0.1:5433`), y la conexión se mantiene **mientras ese comando siga corriendo**. Si se cierra la terminal, la app pierde el acceso a la base.

## Configuración SSL

Railway exige conexiones cifradas (`sslmode=require`).

Cuando se usa el proxy local, el certificado que presenta el servidor pertenece al host remoto de Railway, pero la conexión se hace contra `127.0.0.1`. Al no coincidir el nombre, la verificación falla con:

```text
self-signed certificate in certificate chain
```

Por eso, en `src/database/prisma.js` el SSL **no se configura mediante la URL** sino mediante el objeto `ssl` del pool de `pg`:

```js
const connectionString = process.env.DATABASE_URL.replace(
  /[?&]sslmode=[^&]*/,
  ""
);

const needsSsl = /sslmode=(require|verify)/.test(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString,
  ...(needsSsl && { ssl: { rejectUnauthorized: false } }),
});
```

Se quita `sslmode` de la cadena porque en la versión actual de `pg` ese parámetro implica verificación completa del certificado y **sobrescribe** la configuración del objeto `ssl`.

La conexión sigue cifrada; lo único que se omite es la validación del nombre del host, algo esperable al pasar por un proxy local.

> `rejectUnauthorized: false` es aceptable para desarrollo a través del proxy.
> Si en el futuro la aplicación se conecta directamente al host de Railway, conviene revisar esta configuración.

## Migraciones y seeds en Railway

Los comandos son exactamente los mismos: apuntan a donde apunte `DATABASE_URL`.

```bash
pnpm prisma migrate status   # verificar antes de tocar nada
pnpm prisma migrate deploy   # aplicar migraciones existentes
pnpm seed                    # sembrar datos
```

Diferencia importante entre los dos comandos de migración:

| Comando          | Uso                                                                 |
| ---------------- | ------------------------------------------------------------------- |
| `migrate dev`    | Solo en local. Crea migraciones nuevas y es interactivo.             |
| `migrate deploy` | Para Railway. Solo aplica las migraciones ya existentes, sin prompts. |

> Antes de ejecutar `pnpm seed` conviene confirmar a qué base se está apuntando con `pnpm prisma migrate status`, ya que el seed **borra todas las tablas** antes de recrearlas.

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

El proyecto utiliza **un único seed global** que se encarga de todas las tablas:

```text
prisma/seed.js
```

## Ejecutar el seed

```bash
pnpm seed
```

También queda registrado en `prisma.config.ts`, por lo que Prisma lo ejecuta automáticamente al resetear la base:

```bash
pnpm prisma migrate reset
```

> `migrate reset` borra la base, vuelve a aplicar **todas** las migraciones y después corre el seed.
> `pnpm seed` solo siembra datos, sin tocar la estructura.

## Qué hace el seed

El seed **limpia y recrea** todas las tablas, por lo que se puede ejecutar cuantas veces se necesite obteniendo siempre el mismo resultado.

El orden importa en los dos sentidos, porque las tablas tienen llaves foráneas:

```text
Borrado:  Appointment → Post → TimeBlock → User
Creación: User + TimeBlock → Post + Appointment
```

Primero se borra lo que *depende* de otras tablas y luego se crea lo que *no depende* de nadie.

Datos que genera:

| Tabla         | Cantidad | Detalle                                          |
| ------------- | -------- | ------------------------------------------------ |
| `User`        | 8        | 1 `ADMIN` + 7 `USER`                             |
| `TimeBlock`   | 7        | Bloques de 1 hora: 09–12 y 14–17 (13 h almuerzo) |
| `Post`        | 6        | Repartidos entre varios usuarios                 |
| `Appointment` | 6        | Turnos para la fecha `2026-09-14`                |

## Usuarios creados

Todos comparten la misma contraseña, hasheada con **bcrypt** antes de guardarse:

```text
Contraseña: password123
```

| Email                 | Rol     |
| --------------------- | ------- |
| `admin@example.com`   | `ADMIN` |
| `erick@example.com`   | `USER`  |
| `maria@example.com`   | `USER`  |
| `carlos@example.com`  | `USER`  |
| `ana@example.com`     | `USER`  |
| `luis@example.com`    | `USER`  |
| `sofia@example.com`   | `USER`  |
| `pedro@example.com`   | `USER`  |

Sirven para obtener un token desde `POST /api/auth/login` y probar los endpoints protegidos.

> Estos datos son solo para desarrollo. Nunca usar esta contraseña en un entorno real.

## Por qué un solo archivo

Antes existía una carpeta `database/seed/` con un archivo por tabla y un `index.js` que los lanzaba en procesos separados. Se unificó en `prisma/seed.js` por dos motivos:

* **Los ids no se pueden escribir a mano.** Al estar en archivos separados, el seed de turnos necesitaba conocer los ids de los usuarios y los tenía escritos fijos (`13`, `15`, `16`…). Esos ids solo existían en la base local: al cambiar de base el seed fallaba.
* **Un solo proceso comparte el estado.** Ahora el seed crea los usuarios y guarda un mapa `email → id` en memoria, que reutiliza para crear posts y turnos. Las relaciones se resuelven en tiempo de ejecución y funcionan en cualquier base.

Por eso el seed referencia los datos **por email** y **por índice de bloque horario**, nunca por id.

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
"dev": "node --watch src/server.js"
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
node src/database/test.js
```

También existen archivos de prueba para comprobar funcionalidades específicas de Prisma.

Por ejemplo:

```bash
node src/database/testRole.js
```

Otra forma rápida de verificar contra qué base se está trabajando:

```bash
pnpm prisma migrate status
```

La salida indica el host y el nombre de la base, útil para confirmar si se está apuntando a Docker o a Railway antes de ejecutar el seed.

---

# 📁 Estructura del proyecto

```text
curso-express-js/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js            ← seed global de todas las tablas
│
├── postman/
│   ├── reservations.postman_collection.json
│   └── reservations.postman_folder.json
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── reservationsController.js
│   │   └── userController.js
│   │
│   ├── database/
│   │   ├── prisma.js
│   │   ├── test.js
│   │   └── testRole.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandle.js
│   │   ├── logger.js
│   │   └── requireRole.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── reservationsRoute.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   ├── appointmentService.js
│   │   ├── postService.js
│   │   ├── reservationsService.js
│   │   ├── tokenService.js
│   │   └── userService.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── validations/
│   │       ├── reservationValidation.js
│   │       ├── timeBlockValidation.js
│   │       └── userValidation.js
│   │
│   └── generated/
│       └── prisma/
│
├── .env
├── .env.example
├── .gitignore
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

Ejecutar el seed:

```bash
pnpm seed
```

Aplicar migraciones existentes (Railway):

```bash
pnpm prisma migrate deploy
```

Resetear la base y volver a sembrar:

```bash
pnpm prisma migrate reset
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
* Base de datos desplegada en Railway.
* Prisma como ORM.
* Prisma Client generado.
* Migraciones.
* Modelos `User`, `Post`, `TimeBlock` y `Appointment`.
* Relación entre usuarios y publicaciones.
* Sistema de reservas con bloques horarios.
* Restricción `@@unique` para evitar reservas duplicadas en un mismo horario.
* Roles mediante `enum`.
* Seed global único para todas las tablas.
* Autenticación con JWT.
* Rutas protegidas mediante middleware `auth`.
* Control de acceso por rol y por propiedad del recurso.
* Contraseñas hasheadas con bcrypt.
* Validaciones.
* Middleware personalizado.
* Manejo centralizado de errores.
* Traducción de errores de Prisma a códigos HTTP.
* Logging.
* Colección de Postman para probar los endpoints.
* Separación de responsabilidades.

---

# 👨‍💻 Autor

Proyecto desarrollado como parte del proceso de aprendizaje de desarrollo backend con Node.js, Express.js, PostgreSQL y Prisma.
