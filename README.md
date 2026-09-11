# Curso Express.js

API REST desarrollada con Node.js y Express.js como proyecto práctico para
aprender y aplicar los principales conceptos relacionados con el desarrollo
de servidores y APIs REST.

El proyecto evoluciona progresivamente incorporando manejo de rutas,
middlewares, validaciones, variables de entorno, persistencia de datos,
manejo centralizado de errores y logging.

---

## 📚 Objetivos del proyecto

Este proyecto tiene como objetivo comprender los fundamentos del desarrollo
backend utilizando Node.js y Express.js.

Durante su desarrollo se trabajan los siguientes conceptos:

- Node.js
- Express.js
- Servidores HTTP
- APIs REST
- Métodos HTTP
- Routing
- Request y Response
- Middleware
- Middleware personalizado
- Manejo de errores
- Logging
- Validación de datos
- Variables de entorno
- `process.env`
- Persistencia de información mediante archivos JSON
- Operaciones CRUD
- Módulos ES (`import` / `export`)
- `async` / `await`
- Manejo de excepciones
- Gestión de dependencias con pnpm
- Organización y separación de responsabilidades

---

# 🛠️ Tecnologías utilizadas

- **Node.js** — entorno de ejecución de JavaScript.
- **Express.js** — framework para construir servidores y APIs HTTP.
- **pnpm** — gestor de paquetes utilizado para administrar las dependencias.
- **dotenv** — carga de variables de entorno desde archivos `.env`.
- **JSON** — utilizado como mecanismo de persistencia durante el desarrollo
  del proyecto.

---

# 📁 Estructura del proyecto

```text
curso-express-js/
│
├── database/
│   ├── user.json
│   └── users.js
│
├── middleware/
│   ├── errorHandle.js
│   └── logger.js
│
├── validations/
│   └── userValidation.js
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── pnpm-lock.yaml
└── README.md