# Ubuntu Installation and Deployment Guide

## 1) Get a downloadable zip
From this repository root:

```bash
git archive --format=zip --output Workbench-AI-Google-Studio.zip HEAD
```

You can then share `Workbench-AI-Google-Studio.zip` and unzip it on Ubuntu:

```bash
unzip Workbench-AI-Google-Studio.zip -d Workbench-AI-Google-Studio
cd Workbench-AI-Google-Studio
```

## 2) Install prerequisites on Ubuntu

Run the setup script:

```bash
bash scripts/setup_ubuntu.sh
```

This installs Docker, Node.js 20, and .NET 8 SDK.

## 3) Run in development mode

### Backend + DB

```bash
cd backend
docker compose up -d
cd src/Workbench.Api
dotnet run
```

### Frontend

In another terminal:

```bash
cd frontend-angular
npm install
npm start
```

Open:
- Frontend: `http://localhost:4200`
- API health: `http://localhost:8080/health` (if docker-deployed API) or `https://localhost:5001/health` (local `dotnet run` default profile)

## 4) Deployable install (containers)

From repository root:

```bash
docker compose -f deployment/docker-compose.prod.yml up -d --build
```

Open:
- Web app: `http://localhost:4200`
- API: `http://localhost:8080`

Stop stack:

```bash
docker compose -f deployment/docker-compose.prod.yml down
```

## 5) Environment hardening suggestions

- Move DB credentials to a secrets manager or `.env` not committed to source control.
- Terminate TLS at a reverse proxy (Nginx/Traefik/Caddy) with real certificates.
- Add CI/CD for image build, vulnerability scan, and deployment.
