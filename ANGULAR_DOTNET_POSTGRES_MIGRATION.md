# Angular + .NET + PostgreSQL Migration

This repository now contains an enterprise-grade migration baseline for the AI Workbench:

- `frontend-angular/`: Angular 18 standalone application with routed workbench areas (Dashboard, Companion, Registry, Governance) and typed API integration.
- `backend/src/Workbench.Api/`: ASP.NET Core 8 Web API with layered boundaries (Contracts, Domain, Services, Persistence).
- `backend/docker-compose.yml`: Local PostgreSQL 16 dependency for development environments.

## Enterprise patterns applied

1. **Separation of concerns**: API contracts are isolated from persistence/domain entities.
2. **Scalable backend composition**: Services abstract business logic from controller transport concerns.
3. **Operational readiness**: Serilog request logging and `/health` endpoint added.
4. **Relational persistence**: PostgreSQL schema and indexing for core entities (`models`, `approval_requests`).
5. **Frontend maintainability**: Feature-oriented Angular folders, core service layer, and strict TypeScript config.

## Runbook

### Backend

1. Start PostgreSQL:
   ```bash
   cd backend
   docker compose up -d
   ```
2. Run API (requires .NET 8 SDK):
   ```bash
   cd backend/src/Workbench.Api
   dotnet run
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend-angular
   npm install
   ```
2. Start Angular app:
   ```bash
   npm start
   ```

## Recommended next hardening steps

- Introduce OAuth2/OIDC with role-based authorization policies.
- Add FluentValidation validators for all request contracts.
- Add EF Core migrations and CI deployment pipelines.
- Add integration tests with ephemeral PostgreSQL containers.
- Add observability (OpenTelemetry tracing + metrics).
