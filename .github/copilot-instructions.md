# React Static Gallery Quality

These instructions always apply to this repository.

## Architecture and Structure

- Build as a static frontend-first React + TypeScript app.
- Keep project structure modular and predictable:
  - src/components for reusable UI components.
  - src/features/gallery for gallery-specific UI and logic.
  - src/services for API clients and backend integration adapters.
  - src/types for shared domain and API contracts.
  - src/styles for global style tokens and shared styles.
- Keep components focused: one clear responsibility per component.
- Prefer composition over large monolithic components.
- Keep business logic out of presentational components.

## Code Quality and Maintainability

- Use strict TypeScript and avoid any unless documented with a short justification comment.
- Use explicit interfaces/types for image items, gallery state, and API payloads.
- Keep functions small and named by intent.
- Remove dead code and avoid duplicate utility logic.
- Favor clear naming and readability over clever abstractions.

## UI and Styling Expectations

- Deliver a visually appealing, polished gallery UI with intentional spacing, hierarchy, and typography.
- Use a consistent design system approach with CSS variables for colors, spacing, typography, and radii.
- Ensure responsive behavior for mobile, tablet, and desktop.
- Include accessible semantics:
  - Use meaningful landmarks and heading hierarchy.
  - Ensure keyboard navigability for interactive elements.
  - Provide useful alt text and fallback behavior for images.

## Future Backend Integration Readiness

- Design data access behind a service boundary so backend connections can be added without UI rewrites.
- Keep API endpoint details in configuration, not hardcoded in UI components.
- Use typed request/response contracts and narrow runtime checks at boundaries.

## Container Readiness

- Ensure the app builds as static assets suitable for container hosting.
- Keep runtime assumptions minimal and environment-driven where needed.
- Use a production-oriented Dockerfile strategy (multi-stage build, small runtime image when feasible).

## Testing Requirements

- Add or update tests whenever behavior changes.
- Prioritize tests for:
  - Gallery rendering and filtering/sorting logic.
  - Component interactions and state transitions.
  - Service-layer behavior and data mapping.
- Prefer React Testing Library + Vitest/Jest patterns focused on user-observable behavior.
- Keep tests deterministic and avoid brittle implementation-detail assertions.

## Delivery Checklist

- Build passes in CI/local for TypeScript and frontend bundling.
- Tests pass for changed behavior.
- UI is responsive and visually coherent across breakpoints.
- Code is organized for long-term maintenance and future backend integration.
