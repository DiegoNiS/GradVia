#!/bin/bash

echo "--- Iniciando Pruebas de Endpoints (Flujo Completo) ---"

echo -e "\n1. Creando Usuario..."
USER_RES=$(curl -s -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d "{\"email\":\"test_$(date +%s)@test.com\", \"username\":\"testUser\"}")

echo "Respuesta del Usuario: $USER_RES"
USER_ID=$(echo $USER_RES | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf-8')).id")

if [ "$USER_ID" == "undefined" ] || [ -z "$USER_ID" ]; then
  echo "Error: No se pudo extraer el ID del usuario."
  exit 1
fi
echo "✅ Usuario creado con ID: $USER_ID"


echo -e "\n2. Creando Semestre..."
SEM_RES=$(curl -s -X POST http://localhost:3000/api/semesters \
-H "Content-Type: application/json" \
-d "{\"userId\": \"$USER_ID\", \"name\": \"Semestre de Prueba\", \"isCurrent\": true}")

echo "Respuesta del Semestre: $SEM_RES"
SEM_ID=$(echo $SEM_RES | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf-8')).id")

if [ "$SEM_ID" == "undefined" ] || [ -z "$SEM_ID" ]; then
  echo "Error: No se pudo extraer el ID del semestre."
  exit 1
fi
echo "✅ Semestre creado con ID: $SEM_ID"


echo -e "\n3. Creando Curso (Debería crear las 6 evaluaciones anidadas)..."
COURSE_RES=$(curl -s -X POST http://localhost:3000/api/courses \
-H "Content-Type: application/json" \
-d "{\"semesterId\": \"$SEM_ID\", \"name\": \"Matemáticas Avanzadas\"}")

echo "Respuesta del Curso (Formateada):"
echo $COURSE_RES | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"

echo -e "\n4. Obteniendo Semestres del Usuario (isCurrent rule check)..."
curl -s -X GET http://localhost:3000/api/semesters/user/$USER_ID | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"

echo -e "\n5. Obteniendo Cursos del Semestre (Eager Loading Assessments)..."
COURSES_RES=$(curl -s -X GET http://localhost:3000/api/courses/semester/$SEM_ID)
echo $COURSES_RES | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"

ASSESSMENT_ID=$(echo $COURSES_RES | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf-8'))[0]?.assessments[0]?.id")

if [ "$ASSESSMENT_ID" != "undefined" ] && [ -n "$ASSESSMENT_ID" ]; then
  echo -e "\n6. Modificando Nota de la Primera Evaluación ($ASSESSMENT_ID)..."
  curl -s -X PATCH http://localhost:3000/api/assessments/$ASSESSMENT_ID \
  -H "Content-Type: application/json" \
  -d '{"grade": 15, "weightPercentage": 20}' | node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2)"
else
  echo -e "\nError: No se encontró ninguna evaluación para modificar."
fi

echo -e "\n--- Pruebas Finalizadas ---"
