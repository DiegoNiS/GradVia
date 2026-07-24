#!/bin/bash

echo "--- Iniciando Pruebas de Endpoints (Flujo con Autenticación JWT) ---"

# Verificar si el servidor está corriendo
if ! curl -s http://localhost:3000/api/health > /dev/null; then
  echo -e "\n❌ Error: El servidor no está corriendo en http://localhost:3000"
  echo "Por favor abre otra terminal, navega a /backend y ejecuta: pnpm run dev"
  exit 1
fi

TEST_EMAIL="user_$(date +%s)@test.com"
TEST_PASS="password123"
TEST_USER="user_$(date +%s)"

echo -e "\n1. Registrando Usuario en /api/auth/register..."
REG_RES=$(curl -s -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d "{\"email\":\"$TEST_EMAIL\", \"username\":\"$TEST_USER\", \"password\":\"$TEST_PASS\"}")

echo "Respuesta del Registro: $REG_RES"
USER_ID=$(echo $REG_RES | node -pe "try { JSON.parse(require('fs').readFileSync(0, 'utf-8')).user?.id } catch(e) { '' }")

if [ "$USER_ID" == "undefined" ] || [ -z "$USER_ID" ]; then
  echo "Error: No se pudo registrar el usuario. Revisa si la respuesta contiene un error."
  exit 1
fi
echo "✅ Usuario registrado con ID: $USER_ID"


echo -e "\n2. Iniciando Sesión en /api/auth/login..."
LOGIN_RES=$(curl -s -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d "{\"email\":\"$TEST_EMAIL\", \"password\":\"$TEST_PASS\"}")

TOKEN=$(echo $LOGIN_RES | node -pe "try { JSON.parse(require('fs').readFileSync(0, 'utf-8')).token } catch(e) { '' }")

if [ "$TOKEN" == "undefined" ] || [ -z "$TOKEN" ]; then
  echo "Error: No se pudo obtener el token JWT."
  exit 1
fi
echo "✅ Token JWT Obtenido correctamente."


echo -e "\n3. Probando Endpoint Protegido /api/auth/me..."
curl -s -X GET http://localhost:3000/api/auth/me \
-H "Authorization: Bearer $TOKEN" | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"


echo -e "\n4. Creando Semestre (Con Token JWT)..."
SEM_RES=$(curl -s -X POST http://localhost:3000/api/semesters \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d "{\"userId\": \"$USER_ID\", \"name\": \"Semestre 2026-I\", \"isCurrent\": true}")

SEM_ID=$(echo $SEM_RES | node -pe "try { JSON.parse(require('fs').readFileSync(0, 'utf-8')).id } catch(e) { '' }")
echo "✅ Semestre creado con ID: $SEM_ID"


echo -e "\n5. Creando Curso (Con Token JWT)..."
COURSE_RES=$(curl -s -X POST http://localhost:3000/api/courses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d "{\"semesterId\": \"$SEM_ID\", \"name\": \"Algoritmos Avanzados\"}")

COURSE_ID=$(echo $COURSE_RES | node -pe "try { JSON.parse(require('fs').readFileSync(0, 'utf-8')).id } catch(e) { '' }")
echo "✅ Curso creado con ID: $COURSE_ID"


echo -e "\n6. Consultando Cursos con Evaluaciones (Con Token JWT)..."
COURSES_RES=$(curl -s -X GET http://localhost:3000/api/courses/semester/$SEM_ID \
-H "Authorization: Bearer $TOKEN")
echo $COURSES_RES | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"

ASSESSMENT_ID=$(echo $COURSES_RES | node -pe "try { JSON.parse(require('fs').readFileSync(0, 'utf-8'))[0]?.assessments[0]?.id } catch(e) { '' }")

if [ "$ASSESSMENT_ID" != "undefined" ] && [ -n "$ASSESSMENT_ID" ]; then
  echo -e "\n7. Modificando Nota de Evaluación ($ASSESSMENT_ID)..."
  curl -s -X PATCH http://localhost:3000/api/assessments/$ASSESSMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"grade": 17.5, "weightPercentage": 25}' | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"
fi

echo -e "\n8. Probando Rechazo de Acceso Sin Token (Debe dar Error 401)..."
curl -s -X GET http://localhost:3000/api/courses/semester/$SEM_ID

echo -e "\n\n--- Pruebas de Autenticación Finalizadas ---"
