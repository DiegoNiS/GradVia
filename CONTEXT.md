# Contexto del Proyecto: GradVia (AI Agent Rules)

## 1. Visión General
GradVia es una aplicación híbrida (Web/Móvil) para el registro y gestión de notas académicas por semestre.
- **Objetivo:** Permitir a los estudiantes registrar cursos, evaluaciones (por defecto 6), pesos y predecir promedios.
- **Regla de Negocio Principal:** Solo puede existir un semestre "actual" (`is_current = true`). Los semestres anteriores son de solo lectura lógicamente a nivel de frontend.

## 2. Arquitectura (Monorepo)
El proyecto está estructurado en un único repositorio con dos dominios estrictamente separados. **NUNCA cruces contextos ni dependencias entre ellos.**
- `/backend`: API REST.
- `/frontend`: Cliente Web (y futura PWA/Móvil con Capacitor/React Native).

## 3. Stack Tecnológico
- **Backend:** Node.js, Express, TypeScript.
- **Base de Datos:** PostgreSQL (alojada en Supabase), gestionada a través de Prisma ORM.
- **Frontend:** React, Vite, TypeScript, Tailwind CSS.

## 4. Reglas de Código para el Agente (Obligatorias)
- **Idioma del Código:** Nombres de variables, funciones, tablas de DB y archivos SIEMPRE en inglés (ej. `Semester`, `isCurrent`).
- **Idioma de Interfaz y Comentarios:** Los comentarios explicativos, los mensajes de error de la API y los textos de la interfaz (UI) SIEMPRE en español.
- **Tipado Estricto:** Usa TypeScript siempre. Evita el uso de `any`.
- **Límites de Trabajo:** Si se te pide trabajar en el backend, no analices, leas, ni modifiques la carpeta de frontend, y viceversa.
- **Seguridad:** Nunca expongas credenciales en el código. Las contraseñas en la DB usan hash (Bcrypt/Argon2) y los correos/usuarios se guardan en texto plano pero protegidos por RLS o validación de tokens.

## 5. Estado Actual del Proyecto
- [x] Arquitectura general definida.
- [x] Esquema de Base de Datos relacional diseñado.
- [ ] Backend: Inicializar Prisma, Express y definir endpoints.
- [ ] Frontend: Inicializar Vite + React.