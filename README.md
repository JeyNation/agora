# Agora

Lightweight Next.js application scaffolded with `create-next-app`.

This repository is configured to use pnpm as the package manager and is deployed on Vercel. It uses the Next.js App Router and Tailwind CSS.

## Table of contents

- [Requirements](#requirements)
- [Local development](#local-development)
- [Build for production](#build-for-production)
- [Linting & Formatting](#linting--formatting)
- [Tests](#tests)
- [Deployments](#deployments)
- [Repository structure](#repository-structure)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js 18+ (recommended)
- pnpm v7+ (the project was installed with pnpm v10)
- Git

## Local development

1. Install dependencies:

```powershell
pnpm install
```

2. Run the development server:

```powershell
pnpm dev
```

Open http://localhost:3000 in your browser. The app uses the Next.js App Router—edit files under `src/app` to change pages.

## Build for production

Create an optimized production build:

```powershell
pnpm build
```

Run the production build locally:

```powershell
pnpm start
```

## Linting & Formatting

ESLint is configured. Run:

```powershell
pnpm lint
```

If you add Prettier later, include formatting scripts and configuration.

## Tests

No tests are configured by default. To add testing, consider adding Jest + React Testing Library or Playwright for E2E.

## Deployments

This project is deployed on Vercel and linked to the GitHub repository: `https://github.com/JeyNation/agora`.

- Manual deploy using Vercel CLI:

```powershell
vercel --prod
```

- CI/CD: pushing to `main` will trigger a Vercel deployment (automatic if connected via the Vercel dashboard).

## Repository structure

- `src/app` — App Router pages & layouts
- `src/styles` — global styles (Tailwind configured)
- `public` — static assets

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/some-feature`
3. Commit your changes: `git commit -m "feat: add ..."`
4. Push branch and open a Pull Request

## License

This project is provided under the MIT License. See the `LICENSE` file for details.

---

If you'd like, I can also:
- Add a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`
- Add a GitHub Actions workflow for linting and building on PRs
- Add basic unit tests and an example test

Tell me which you'd like next and I'll implement it.
