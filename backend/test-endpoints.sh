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

echo -e "\n--- Pruebas Finalizadas ---"
