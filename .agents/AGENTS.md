# GradVia Project Rules

Estas son las reglas y directrices globales que todos los sub-agentes deben seguir al trabajar en el proyecto GradVia.

## 1. Arquitectura (Monorepo)
- **Separación Estricta:** El proyecto está estructurado en `/backend` (API REST) y `/frontend` (Cliente Web/PWA). **NUNCA** cruces contextos ni dependencias entre ellos.
- Si se te pide trabajar en el backend, no analices, leas, ni modifiques la carpeta de frontend, y viceversa.

## 2. Stack Tecnológico
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Frontend:** React, Vite, TypeScript, Tailwind CSS.
- **Package Manager:** Usa SIEMPRE **`pnpm`** para instalar o gestionar dependencias. Evita usar `npm` o `yarn`.

## 3. Reglas de Código e Idioma (¡OBLIGATORIAS!)
- **Idioma del Código:** Los nombres de variables, funciones, clases, tablas de base de datos y nombres de archivos deben estar **SIEMPRE en inglés** (ej. `Semester`, `isCurrent`, `course.controller.ts`).
- **Idioma de Interfaz y Comentarios:** Los comentarios explicativos en el código, los mensajes de error devueltos por la API (ej. res.status(400).json({ error: "..." })) y los textos mostrados en la interfaz (UI) deben estar **SIEMPRE en español**.
- **Tipado Estricto:** Usa TypeScript siempre. Evita a toda costa el uso de `any`.

## 4. Reglas de Negocio Clave
- **Semestre Único:** Solo puede existir un semestre "actual" (`isCurrent = true`) por usuario. Al crear o actualizar un semestre a actual, los demás deben pasar a `false`.
- **Evaluaciones por Defecto (Cursos):** Al crear un curso, se DEBEN crear automáticamente 6 evaluaciones utilizando una Transacción de Prisma o escrituras anidadas (nested writes):
  - 3 de tipo `MIDTERM` ("Parcial 1", "Parcial 2", "Parcial 3")
  - 3 de tipo `CONTINUOUS` ("Continua 1", "Continua 2", "Continua 3")

## 5. Seguridad
- **Nunca expongas credenciales en el código.**
- Las contraseñas en la base de datos deben usar hashing (Bcrypt/Argon2).
