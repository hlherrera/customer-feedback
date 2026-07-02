def test_create_and_list_feedback(client):
    payload = {
        "email": "person@example.com",
        "comment": "Great coffee.",
        "rating": 5,
        "highlight": "Coffee",
    }

    created = client.post("/api/feedback", json=payload)
    assert created.status_code == 201
    assert created.json()["email"] == payload["email"]

    listed = client.get("/api/feedback")
    assert listed.status_code == 200
    assert len(listed.json()) == 1
