<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Workbench Migration Workspace

This repository now includes an enterprise migration baseline from the original React prototype to:

- **Angular 18** frontend (`frontend-angular/`)
- **ASP.NET Core 8 Web API** backend (`backend/src/Workbench.Api/`)
- **PostgreSQL** persistence (`backend/docker-compose.yml`)

## Migration guide

See [ANGULAR_DOTNET_POSTGRES_MIGRATION.md](./ANGULAR_DOTNET_POSTGRES_MIGRATION.md) for architecture, setup steps, and hardening recommendations.

## Legacy app

The original React prototype files are still present at repository root for reference during transition.


## Ubuntu install and deploy

See [INSTALL_UBUNTU.md](./INSTALL_UBUNTU.md) for zip export, Ubuntu setup, and container deployment instructions.
