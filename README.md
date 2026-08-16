# Claims Management UI

Angular frontend for the Claims Management application.

The UI provides a simple interface for claimants, claims officers and managers to work with claims. The focus of this application is not on building a complex UI, but on keeping the user journeys clear and making the frontend easy to maintain.

## What the UI covers

Current plan is the application focuses on the main claim lifecycle:

* Create and submit a claim
* View claims and their current status
* View claim details
* Assign claims to claims officers
* Record an assessment
* Approve or reject a claim
* View claim status history
* View team workload and outstanding claims

The same Angular application is used by the different user types. The screens and available actions can be controlled based on the user's role.

But given the time contraints, I dont think I can complete it whole as the frontend is given lower priority than backend.

## Tech stack

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Reactive Forms
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

The claims screen provides a list of claims and officer assigned to that

### Claim details

The claim details screen brings together the information needed to work on a claim:


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

For example:

```text
GET  /api/v1/claims
GET  /api/v1/claims/{id}
POST /api/v1/claims
POST /api/v1/claims/{id}/assignment
POST /api/v1/claims/{id}/assessments
GET  /api/v1/workload
```

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

The application should then be available through the Angular development server.

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
