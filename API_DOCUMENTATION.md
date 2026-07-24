# GradVia - API Documentation & Integration Guide for Frontend

Este documento sirve como especificación oficial y contrato de la API REST del backend de **GradVia** para ser consumido por el Frontend (React + TypeScript).

---

## 1. Información General del Servidor

- **Base URL:** `http://localhost:3000/api`
- **Formato de datos:** JSON (`Content-Type: application/json`)
- **Autenticación:** JWT (JSON Web Tokens) mediante la cabecera HTTP:
  ```http
  Authorization: Bearer <TOKEN>
  ```

---

## 2. Tipos de Datos y Modelos (TypeScript Interfaces)

Puedes copiar directamente estos tipos en el proyecto de Frontend para mantener la paridad estricta con la base de datos:

```typescript
export type AssessmentType = 'MIDTERM' | 'CONTINUOUS' | 'SUBSTITUTE' | 'OTHER';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Semester {
  id: string;
  userId: string;
  name: string;
  isCurrent: boolean;
  createdAt: string;
  courses?: Course[];
}

export interface Course {
  id: string;
  semesterId: string;
  name: string;
  isArchived: boolean;
  createdAt: string;
  assessments?: Assessment[];
}

export interface Assessment {
  id: string;
  courseId: string;
  name: string;
  type: AssessmentType;
  weightPercentage: number | null; // Decimal (0 a 100)
  grade: number;                  // Decimal (0 a 20)
  createdAt: string;
}
```

---

## 3. Reglas de Negocio Clave que el Frontend debe saber

1. **Creación Automática de Notas en Cursos:**
   - Al llamar a `POST /api/courses`, el backend crea **automáticamente 6 evaluaciones por defecto** para ese curso (3 `MIDTERM`: "Parcial 1", "Parcial 2", "Parcial 3" y 3 `CONTINUOUS`: "Continua 1", "Continua 2", "Continua 3").
2. **Regla del Semestre Activo (`isCurrent`):**
   - Solo puede haber **un solo semestre** con `isCurrent: true` por usuario. Si se crea o edita un semestre enviando `isCurrent: true`, el backend desmarcará automáticamente los semestres anteriores.
3. **Escala de Calificaciones y Pesos:**
   - La nota (`grade`) es un número de **0 a 20** (por defecto `0`).
   - El peso (`weightPercentage`) es un número porcentual opcional de **0 a 100**.

---

## 4. Catálogo Completo de Endpoints

### 🔐 Autenticación (`/api/auth`)

#### 1. Registro de Usuario
- **Ruta:** `POST /api/auth/register`
- **Autenticación:** Pública
- **Body:**
  ```json
  {
    "email": "estudiante@gradvia.com",
    "username": "estudiante123",
    "password": "contrasenaSegura123"
  }
  ```
- **Respuesta (201 Created):**
  ```json
  {
    "user": {
      "id": "uuid-del-usuario",
      "email": "estudiante@gradvia.com",
      "username": "estudiante123",
      "createdAt": "2026-07-24T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
  ```

#### 2. Inicio de Sesión
- **Ruta:** `POST /api/auth/login`
- **Autenticación:** Pública
- **Body:**
  ```json
  {
    "email": "estudiante@gradvia.com",
    "password": "contrasenaSegura123"
  }
  ```
- **Respuesta (200 OK):**
  ```json
  {
    "user": {
      "id": "uuid-del-usuario",
      "email": "estudiante@gradvia.com",
      "username": "estudiante123",
      "createdAt": "2026-07-24T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
  ```

#### 3. Obtener Usuario en Sesión (Me)
- **Ruta:** `GET /api/auth/me`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** Objeto `User`.

---

### 📅 Semestres (`/api/semesters`)

#### 1. Crear Semestre
- **Ruta:** `POST /api/semesters`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Body:**
  ```json
  {
    "userId": "uuid-del-usuario",
    "name": "Semestre 2026-I",
    "isCurrent": true
  }
  ```
- **Respuesta (201 Created):** Objeto `Semester`.

#### 2. Listar Semestres de un Usuario
- **Ruta:** `GET /api/semesters/user/:userId`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** Lista de `Semester[]` ordenada descendentemente por fecha.

#### 3. Obtener Semestre por ID
- **Ruta:** `GET /api/semesters/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** Objeto `Semester` incluyendo su árbol de `courses` y `assessments`.

#### 4. Editar Semestre
- **Ruta:** `PATCH /api/semesters/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Body (campos opcionales):**
  ```json
  {
    "name": "Semestre 2026-I Editado",
    "isCurrent": true
  }
  ```
- **Respuesta (200 OK):** Objeto `Semester` actualizado.

#### 5. Eliminar Semestre
- **Ruta:** `DELETE /api/semesters/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** `{"message": "Semester deleted successfully"}` *(Elimina sus cursos y notas en cascada)*.

---

### 📚 Cursos (`/api/courses`)

#### 1. Crear Curso
- **Ruta:** `POST /api/courses`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Body:**
  ```json
  {
    "semesterId": "uuid-del-semestre",
    "name": "Matemáticas Discretas"
  }
  ```
- **Respuesta (201 Created):** Objeto `Course` **incluyendo sus 6 evaluaciones automáticas creadas**.

#### 2. Listar Cursos de un Semestre (con Evaluaciones)
- **Ruta:** `GET /api/courses/semester/:semesterId`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** Lista de `Course[]` conteniendo cada uno sus `assessments[]`.

#### 3. Obtener Curso por ID
- **Ruta:** `GET /api/courses/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** Objeto `Course` con sus `assessments`.

#### 4. Editar o Archivar Curso
- **Ruta:** `PATCH /api/courses/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Body (campos opcionales):**
  ```json
  {
    "name": "Nuevo Nombre",
    "isArchived": true
  }
  ```
- **Respuesta (200 OK):** Objeto `Course` actualizado.

#### 5. Eliminar Curso
- **Ruta:** `DELETE /api/courses/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** `{"message": "Course deleted successfully"}` *(Elimina sus notas en cascada)*.

---

### 📝 Evaluaciones / Notas (`/api/assessments`)

#### 1. Crear Evaluación Extra/Personalizada
- **Ruta:** `POST /api/assessments`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Body:**
  ```json
  {
    "courseId": "uuid-del-curso",
    "name": "Trabajo de Investigación Extra",
    "type": "OTHER",
    "weightPercentage": 10,
    "grade": 16
  }
  ```
- **Respuesta (201 Created):** Objeto `Assessment`.

#### 2. Actualizar Nota o Peso de Evaluación
- **Ruta:** `PATCH /api/assessments/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Body (campos opcionales):**
  ```json
  {
    "name": "Parcial 1 Modificado",
    "grade": 17.5,
    "weightPercentage": 25
  }
  ```
- **Respuesta (200 OK):** Objeto `Assessment` actualizado.

#### 3. Eliminar Evaluación
- **Ruta:** `DELETE /api/assessments/:id`
- **Autenticación:** Requerida (`Bearer <TOKEN>`)
- **Respuesta (200 OK):** `{"message": "Assessment deleted successfully"}`.

---

## 5. Códigos de Estado y Manejo de Errores

Si una petición falla, la API responderá con uno de estos formatos estandarizados:

- **400 Bad Request (Error de Validación Zod):**
  ```json
  {
    "error": "Error de validación",
    "details": [
      {
        "field": "email",
        "message": "El correo electrónico no es válido"
      }
    ]
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Access token required"
  }
  ```
- **403 Forbidden:**
  ```json
  {
    "error": "Invalid or expired token"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "error": "Recurso no encontrado"
  }
  ```
- **500 Internal Server Error:**
  ```json
  {
    "status": "error",
    "message": "Mensaje del error"
  }
  ```
