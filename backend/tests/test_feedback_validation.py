def test_feedback_requires_fields(client):
    response = client.post("/api/feedback", json={})
    assert response.status_code == 400
    assert response.json() == {
        "type": "about:blank",
        "title": "Bad Request",
        "detail": "Email is required.",
        "status": 400,
    }


def test_feedback_validates_values(client):
    payload = {
        "email": "bad-email",
        "comment": "",
        "rating": 6,
        "highlight": "Speed",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email must be a valid email address."


def test_feedback_validates_email_format(client):
    payload = {
        "email": "bad-email",
        "comment": "Nice visit.",
        "rating": 4,
        "highlight": "Service",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email must be a valid email address."


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
    assert response.json()["detail"] == "Unexpected field: unknown."


def test_feedback_validates_rating_range(client):
    payload = {
        "email": "person@example.com",
        "comment": "Nice visit.",
        "rating": 6,
        "highlight": "Service",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Rating must be a whole number between 1 and 5."
    )


def test_feedback_validates_highlight_options(client):
    payload = {
        "email": "person@example.com",
        "comment": "Nice visit.",
        "rating": 4,
        "highlight": "Speed",
    }

    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Visit highlight must be Food, Coffee, Service, or Atmosphere."
    )
