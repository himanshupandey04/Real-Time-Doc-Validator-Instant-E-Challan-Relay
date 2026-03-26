# Contributing to ECR — E-Challan Relay System

Thank you for your interest in contributing! ECR is an open-source civic-tech project aimed at automating traffic enforcement in India. Every contribution — bug fixes, documentation, new features, or translations — is valued.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Good First Issues](#good-first-issues)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. **Fork** the repository using the GitHub UI
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Real-Time-Doc-Validator-Instant-E-Challan-Relay.git
   cd Real-Time-Doc-Validator-Instant-E-Challan-Relay
   ```
3. **Add upstream remote** to keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/himanshupandey04/Real-Time-Doc-Validator-Instant-E-Challan-Relay.git
   ```

---

## Development Setup

Follow the [README.md](README.md#getting-started) for the full setup. Quick summary:

```bash
# Frontend + root
npm install

# Backend
cd backend && npm install

# ML Service
cd ../ml_service && pip install -r requirements.txt
```

Ensure MongoDB is running locally on port `27017` before starting.

### Environment Variables

Copy and fill in the template files:
- `backend/.env` — MongoDB URI, JWT secret
- `ml_service/app/.env` — Gmail credentials for SMTP

> **Tip:** See [`docs/SETUP.md`](docs/SETUP.md) for step-by-step Gmail App Password instructions.

---

## Making Changes

1. **Create a branch** for your change:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. Make your changes. Keep them **focused** — one feature or fix per PR.

3. **Test your changes** locally by running the full stack via `npm run dev`.

4. Commit following the guidelines below.

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>
```

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build scripts, CI, config |

**Examples:**
```
feat: add confidence threshold config for YOLO detection
fix: normalize plate strings before dataset lookup
docs: add Gmail App Password setup guide to SETUP.md
chore: add GitHub Actions CI for frontend build check
```

---

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

2. Open a Pull Request against `main` on the upstream repo.

3. Fill in the PR template — describe **what** changed and **why**.

4. A maintainer will review within a few days. Be ready for feedback.

---

## Good First Issues

New to the project? Look for issues tagged [`good first issue`](../../issues?q=is:issue+is:open+label:"good+first+issue"). These are well-scoped tasks that don't require deep system knowledge.

Great areas for contribution:
- 🌏 **Regional plate formats** — Improve ANPR accuracy for specific state plates
- 📄 **Documentation** — Setup guides, API reference, architecture diagrams
- 🧪 **Test coverage** — Unit tests for the ML service or backend routes
- 🌐 **Localization** — Support for regional languages in the citizen portal
- 📱 **Mobile responsiveness** — Improve UI on smaller screens

---

## Code of Conduct

Be respectful, constructive, and collaborative. This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

Thank you for helping make Indian roads safer. 🚦
