#!/usr/bin/env bash
# Teste toutes les opérations CRUD. Le backend doit tourner sur le port 8000.
API=${API:-http://localhost:8000}

echo "=== 1. CREATE ==="
curl -s -X POST $API/products -H "Content-Type: application/json" \
  -d '{"name":"Clavier","description":"Clavier mécanique","price":59.9,"quantity":10}' | tee /tmp/created.json
echo
ID=$(python3 -c "import json;print(json.load(open('/tmp/created.json'))['id'])")

echo "=== 2. READ ALL ==="
curl -s $API/products; echo

echo "=== 3. READ ONE (id=$ID) ==="
curl -s $API/products/$ID; echo

echo "=== 4. UPDATE (id=$ID) ==="
curl -s -X PUT $API/products/$ID -H "Content-Type: application/json" \
  -d '{"name":"Clavier RGB","description":"Version modifiée","price":79.9,"quantity":5}'; echo

echo "=== 5. DELETE (id=$ID) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X DELETE $API/products/$ID

echo "=== Vérification : produit supprimé (404 attendu) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" $API/products/$ID
