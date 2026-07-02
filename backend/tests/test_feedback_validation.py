def test_feedback_requires_fields(client):
    response = client.post("/api/feedback", json={})
    assert response.status_code == 400


def test_feedback_validates_values(client):
    payload = {
        "email": "bad-email",
        "comment": "",
        "rating": 6,
        "highlight": "Speed",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400


def test_feedback_validates_email_format(client):
    payload = {
        "email": "bad-email",
        "comment": "Nice visit.",
        "rating": 4,
        "highlight": "Service",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400


def test_feedback_rejects_extra_fields(client):
    payload = {
        "email": "person@example.com",
        "comment": "Nice visit.",
        "rating": 4,
        "highlight": "Service",
        "unknown": "nope",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400
