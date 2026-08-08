# Reglas de Proyecto: GradVia

Este archivo define las directrices arquitectónicas, de estilo y las convenciones de código para el proyecto GradVia. Cualquier agente de IA que trabaje en este código debe leer y aplicar estas reglas estrictamente.

## 1. Arquitectura y Monorepo
- **Separación Estricta:** El proyecto es un monorepo dividido en `/frontend` y `/backend`. Nunca se debe mezclar lógica de servidor en el frontend.
- **Frontend:** React + TypeScript + Vite + Tailwind CSS.
- **Backend:** Node.js + Prisma ORM (PostgreSQL) + Express/Fastify.
- **Idioma del Código:** Toda la lógica, nombres de variables, funciones e IDs deben estar en **Inglés**.
- **Idioma de la UI/Comentarios:** Todos los textos visibles para el usuario en la interfaz y los comentarios explicando el funcionamiento deben estar en **Español**.

## 2. Frontend: Estética y Diseño (Dark Glassmorphism)
- **Fondo General:** Oscuro casi negro (ej. `bg-black` o `bg-zinc-950`). Las animaciones de fondo (como los orbes) deben renderizarse con `z-0` para ubicarse por detrás de los paneles principales.
- **Efecto Glassmorfismo:** Los contenedores principales, paneles y tarjetas deben usar fondos semitransparentes (ej. `bg-white/10` o `bg-white/5`), combinados con desenfoque (`backdrop-blur-xl`), bordes muy sutiles (`border border-white/20`) y sombras (`shadow-2xl` o `shadow-lg`).
- **Tipografía (Minimalista):**
  - Fuente principal y única: **Inter**.
  - Escala de fuentes reducida: Los títulos no deben superar `text-xl` o `text-lg` con peso `font-medium`.
  - Las descripciones y textos secundarios deben usar `text-sm` o `text-xs` en color gris (ej. `text-gray-400`).
  - No usar `font-bold` (negrita extrema), para mantener un aspecto ligero, limpio y moderno.
- **Rastreo de Elementos (ID Obligatorio):** Todo componente, contenedor o bloque funcional importante en el frontend DEBE estar encapsulado en un elemento html (ej. `<div id="...">` o `<section id="...">`) con un atributo `id` descriptivo y único (ej. `id="panel-semesters"`, `id="course-list-container"`). No se deben dejar componentes sin ID, esto es vital para el mantenimiento.

## 3. Manejo de Datos y API
- **Esquema Prisma:** Mantener alineación estricta entre las interfaces de TypeScript en el frontend (`src/types/index.ts`) y el `schema.prisma` del backend.
- **Consumo de Datos:** El backend de GradVia envía datos anidados gracias al *eager loading*. El frontend debe prever esto en sus interfaces (ej. un Curso tiene un arreglo opcional de Assessments).
- **Resiliencia UI:** Si el backend falla, la red se cae, o una consulta devuelve arreglos vacíos, la interfaz jamás debe romperse. Siempre se deben implementar estados de carga (spinners elegantes) y estados vacíos (*fallbacks* visuales) que encajen con la estética minimalista de la app.
