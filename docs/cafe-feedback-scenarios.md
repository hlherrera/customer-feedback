# Cafe Feedback Scenarios And Architecture

## Functional Scenarios

```gherkin
Feature: Seeded cafe feedback
  Customers can select a seeded cafe before submitting feedback so every review
  is stored against a known cafe/store.

  Background:
    Given the database has been initialized
    And the seeded cafes include "McDonald's", "BK", and "KFC"

  Scenario: Customer sees available cafes
    When the frontend requests the available cafes
    Then the API returns the seeded cafe list
    And each cafe includes an id, name, and description

  Scenario: Customer submits feedback for a cafe
    Given the customer selects a cafe from the dropdown
    And the customer enters a valid email
    And the customer enters a comment
    And the customer chooses a rating from 1 to 5
    And the customer chooses a visit highlight
    When the customer submits the feedback form
    Then the API stores the feedback with the selected cafe reference
    And the response includes the embedded cafe details
    And the frontend adds the new review to recent feedback

  Scenario: Customer cannot submit feedback without a cafe
    Given the customer has not selected a cafe
    When the customer submits the feedback form
    Then the frontend shows a cafe validation error
    And the API contract also rejects requests without cafe_id

  Scenario: API rejects feedback for an unknown cafe
    Given the request contains a cafe_id that does not exist
    When the request is submitted to the feedback API
    Then the API returns a 400 problem response
    And the detail says "Cafe must be one of the available cafes."

  Scenario: Recent feedback shows cafe context
    Given feedback exists for a seeded cafe
    When the frontend loads recent feedback
    Then each review displays the cafe name
    And each review includes rating, highlight, comment, email, and date

  Scenario: Cafe loading does not depend on feedback loading
    Given recent feedback cannot be loaded
    When the cafe list loads successfully
    Then the cafe dropdown remains enabled
    And the customer can still select a cafe
```

## Architecture Dimensions

- Contract first: `backend/app/api/openapi.yaml` defines `GET /cafes`, required `cafe_id` on feedback creation, and embedded cafe data in feedback responses.
- Persistence: `CafeModel` owns seeded cafe data; `Feedback` stores `cafe_id` as the required relationship to a cafe.
- Repositories: cafe persistence and feedback persistence stay separate, so each module has one reason to change.
- Services: cafe and feedback services keep controller workflow small while preserving the existing project pattern.
- Controllers: controllers orchestrate request validation, cafe existence checks, sync DB work through the async boundary, and HTTP response shape.
- Frontend API: `feedbackApi.ts` keeps fetch/error handling in one small adapter and uses relative `/api` paths through the Vite proxy.
- Frontend UI: `CafeSelect`, `FeedbackForm`, and `FeedbackList` stay presentational and declarative; `App` owns loading, submission, and page state.

## Quality Coverage

- Backend API tests cover seeded cafes, idempotent seeding, valid cafe-backed feedback, missing cafe selection, unknown cafe rejection, and feedback listing with cafe data.
- Frontend tests cover cafe dropdown rendering, draft validation with `cafe_id`, independent cafe loading when feedback loading fails, and display of the cafe name in recent feedback.
- Bruno flow covers listing cafes, creating cafe-backed feedback, and listing feedback.

## Operational Notes

- This project intentionally does not use migrations. For local SQLite, delete `backend/feedback.db` when moving from the old schema to the cafe-backed schema.
- During local frontend development, keep `VITE_API_PROXY_TARGET` pointed at the backend origin and let Vite proxy relative `/api` requests.
