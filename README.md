# Claims Management UI

Angular frontend for the Claims Management application.

The UI provides a simple interface for claimants, claims officers and managers to work with claims. The focus of this application is not on building a complex UI, but on keeping the user journeys clear and making the frontend easy to maintain.

## What the UI covers

The application currently focuses on the main claim lifecycle:

* Create and submit a claim
* View claims and their current status
* View claim details
* Assign claims to claims officers
* Record an assessment
* Approve or reject a claim
* View claim status history
* View team workload and outstanding claims

The same Angular application is used by the different user types. The screens and available actions can be controlled based on the user's role.

## Tech stack

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Reactive Forms
* RxJS
* CSS
* REST APIs exposed by the Spring Boot backend

## Project structure

The frontend is organised around business features rather than technical layers.

```text
src/app/

├── core/
│   ├── services/
│   └── interceptors/
│
├── shared/
│   └── components/
│
├── features/
│   ├── claims/
│   │   ├── components/
│   │   │   ├── claim-list/
│   │   │   ├── claim-detail/
│   │   │   └── claim-form/
│   │   └── services/
│   │       └── claim.service.ts
│   │
│   ├── workload/
│   │   ├── components/
│   │   │   └── workload-dashboard/
│   │   ├── models/
│   │   │   └── workload.model.ts
│   │   ├── pages/
│   │   │   └── workload-page/
│   │   └── services/
│   │       └── workload.service.ts
│   │
│   └── dashboard/
│       └── dashboard.component.ts
│
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

I have kept the structure deliberately simple. As the application grows, new functionality can be added as a feature without making the rest of the application harder to navigate.

## Main screens

### Claims

The claims screen provides a list of claims with basic filtering by status, market and assigned officer.

From here, a user can open an individual claim and see its current state and available actions.

### Claim details

The claim details screen brings together the information needed to work on a claim:

* Claimant information
* Incident details
* Current claim status
* Assigned officer
* Assessment information
* Decision information
* Status history

The available actions depend on the current claim status and the user's role.

### Workload

The workload screen is aimed at claims officers and managers.

It provides a simple view of:

* Number of claims assigned to each officer
* Claims currently under assessment
* Unassigned claims
* Outstanding claims
* Overall claim workload

The intention is to give managers a quick view rather than build a full reporting platform.

## API integration

The frontend communicates with the backend through REST APIs.

### Primary API URLs

These are the two main backend URLs used by the application:

| Feature | HTTP method | Backend URL | Frontend screen |
| --- | --- | --- | --- |
| Claims | `GET`, `POST` | `http://localhost:8080/api/v1/claims` | `http://localhost:4200/claims` |
| Workload | `GET` | `http://localhost:8080/api/v1/workload` | `http://localhost:4200/workload` |

The claims screen uses the claims URL to load existing claims and submit new claims. The workload screen uses the workload URL to load total claims, liability exposure, queue activity and officer workload data.

For example:

```text
GET  /api/v1/claims
GET  /api/v1/claims/{id}
POST /api/v1/claims
POST /api/v1/claims/{id}/assignment
POST /api/v1/claims/{id}/assessments
POST /api/v1/claims/{id}/decision
GET  /api/v1/workload
```

The workload response is validated before it is rendered. The API returns a response envelope with `success`, `data`, `message` and `timestamp`. The nested data must include total claim count, USD liability exposure, assigned claims, claims under assessment, unassigned claims, outstanding claims and officer workload rows containing staff numbers and assigned claim numbers.

API calls are kept inside feature-specific services rather than being made directly from components.

For example:

```text
ClaimComponent
      |
      v
ClaimService
      |
      v
HttpClient
      |
      v
Spring Boot REST API
```

This keeps components focused on presentation and user interaction.

## Forms and validation

Reactive Forms are used for claim creation, assessment and decision workflows.

Validation is performed on the client for immediate feedback, but the backend remains the source of truth for business validation.

For example, the UI can validate that:

* Required fields have been entered
* Monetary values are valid
* Dates are in the expected format

The backend is still responsible for rules such as:

* A claim cannot be approved before it has been assessed
* A claim cannot be assigned after it has been closed
* A settlement amount must be valid for the decision

This avoids duplicating business rules between the frontend and backend.

## Error handling

The UI handles common API errors and presents a user-friendly message rather than exposing raw backend errors.

For example:

```text
400 - Validation error
404 - Claim not found
409 - Claim has been updated by someone else
500 - Unexpected server error
```

The API's error response is treated as a contract between the frontend and backend.

## Configuration

The backend URL should be configurable rather than hard-coded into individual services.

For example:

```text
API_URL=http://localhost:8080/api/v1
```

This allows the same frontend to be used against local, test and other environments without changing application code.

## Running locally

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The two frontend screens are available at:

```text
Claims:   http://localhost:4200/claims
Workload:  http://localhost:4200/workload
```

The backend API URLs used by these screens are:

```text
Claims:   http://localhost:8080/api/v1/claims
Workload:  http://localhost:8080/api/v1/workload
```

The Spring Boot backend needs to be running separately for the claim APIs to work.

## Design decisions

### Feature-based structure

The application is organised around business features such as claims and workload. This makes it easier to locate related components, services and models.

### Thin components

Components should primarily deal with presentation and user interaction. API calls and reusable application logic belong in services.

### Backend owns business rules

The frontend provides validation and a good user experience, but it does not become the source of truth for claim processing rules.

### Simple state management

The application does not introduce a heavyweight state-management library for the current scope. Most of the data is request-driven and can be managed using Angular services, observables/signals and component state.

A more sophisticated state-management solution can be introduced later if the application develops more complex cross-feature state.

### Same application for different roles

Claimants, claims officers and managers use the same Angular application. Role-specific behaviour is handled through routing and permissions rather than maintaining separate applications.

## Scope and future improvements

The current UI is intentionally focused on the main business flows required for the assessment.

## Production readiness roadmap

When time permits, the following work should be completed before using the UI in production:

* Move API URLs into environment-specific Angular configuration for local, test and production deployments.
* Add authentication and role-based route guards for claimants, claims officers and managers.
* Add HTTP interceptors for authentication headers, consistent error handling and request correlation IDs.
* Replace component-level request state with a shared approach for caching, retries and stale data handling where needed.
* Add comprehensive unit, integration and end-to-end tests for claims submission, API failures and workload reporting.
* Improve accessibility verification with automated Axe checks and manual keyboard and screen-reader testing.
* Add claim detail, assignment, assessment, decision and status-history workflows.
* Add secure document upload, virus scanning and controlled document preview if claim evidence is required.
* Add pagination, filtering and server-side sorting for larger claim queues.
* Add observability, audit logging and performance monitoring for production support.
* Add CI checks for formatting, linting, tests, security scanning and production builds.

For a production implementation, I would consider adding:

* Authentication through the organisation's identity provider
* Role-based route guards and permissions
* More comprehensive accessibility support
* Claim document upload and preview
* Advanced filtering and pagination
* Notifications
* More detailed management dashboards
* Better handling of long-running asynchronous operations
* Automated component and end-to-end tests
* Improved responsive/mobile layouts

The goal of this frontend is to provide a clean working interface around the core claims workflow without spending disproportionate effort on UI complexity.
