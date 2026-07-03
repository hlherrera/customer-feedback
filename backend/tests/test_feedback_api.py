import app.main as main


def test_list_cafes_returns_seeded_options(client):
    response = client.get("/api/cafes")

    assert response.status_code == 200
    assert [cafe["name"] for cafe in response.json()] == ["McDonald's", "BK", "KFC"]


def test_cafe_seeding_is_idempotent(monkeypatch, tmp_path):
    db_path = tmp_path / "test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite+pysqlite:///{db_path}")

    with main.create_app().test_client() as first_client:
        first = first_client.get("/api/cafes")

    with main.create_app().test_client() as second_client:
        second = second_client.get("/api/cafes")

    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json() == first.json()


def test_create_and_list_feedback(client):
    cafe = client.get("/api/cafes").json()[0]
    payload = {
        "cafe_id": cafe["id"],
        "email": "person@example.com",
        "comment": "Great coffee.",
        "rating": 5,
        "highlight": "Coffee",
    }

    created = client.post("/api/feedback", json=payload)
    assert created.status_code == 201
    assert created.json()["email"] == payload["email"]
    assert created.json()["cafe"] == cafe

    listed = client.get("/api/feedback")
    assert listed.status_code == 200
    assert len(listed.json()) == 1
    assert listed.json()[0]["cafe"] == cafe


def test_create_feedback_rejects_unknown_cafe(client):
    payload = {
        "cafe_id": 999,
        "email": "person@example.com",
        "comment": "Great coffee.",
        "rating": 5,
        "highlight": "Coffee",
    }

    response = client.post("/api/feedback", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "Cafe must be one of the available cafes."
