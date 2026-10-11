SAMPLE = {"name": "Clavier", "description": "Mécanique", "price": 59.9, "quantity": 10}


def create(client, **overrides):
    return client.post("/products", json={**SAMPLE, **overrides})


def test_create_product(client):
    r = create(client)
    assert r.status_code == 201
    body = r.json()
    assert body["id"] == 1
    assert body["name"] == "Clavier"


def test_list_products(client):
    create(client, name="A")
    create(client, name="B")
    r = client.get("/products")
    assert r.status_code == 200
    assert [p["name"] for p in r.json()] == ["A", "B"]


def test_get_product(client):
    pid = create(client).json()["id"]
    r = client.get(f"/products/{pid}")
    assert r.status_code == 200
    assert r.json()["price"] == 59.9


def test_get_product_not_found(client):
    assert client.get("/products/999").status_code == 404


def test_update_product(client):
    pid = create(client).json()["id"]
    r = client.put(f"/products/{pid}", json={**SAMPLE, "name": "Clavier RGB", "price": 79.9})
    assert r.status_code == 200
    assert r.json()["name"] == "Clavier RGB"
    assert client.get(f"/products/{pid}").json()["price"] == 79.9


def test_update_product_not_found(client):
    assert client.put("/products/999", json=SAMPLE).status_code == 404


def test_delete_product(client):
    pid = create(client).json()["id"]
    assert client.delete(f"/products/{pid}").status_code == 204
    assert client.get(f"/products/{pid}").status_code == 404


def test_delete_product_not_found(client):
    assert client.delete("/products/999").status_code == 404


def test_search_by_name_case_insensitive(client):
    create(client, name="Clavier", description=None)
    create(client, name="Souris", description=None)
    r = client.get("/products", params={"search": "cLA"})
    assert [p["name"] for p in r.json()] == ["Clavier"]


def test_search_in_description(client):
    create(client, name="X", description="sans fil")
    create(client, name="Y", description="filaire")
    r = client.get("/products", params={"search": "sans"})
    assert [p["name"] for p in r.json()] == ["X"]


def test_validation_blank_name(client):
    assert create(client, name="   ").status_code == 422


def test_validation_negative_price(client):
    assert create(client, price=-1).status_code == 422


def test_validation_negative_quantity(client):
    assert create(client, quantity=-5).status_code == 422
