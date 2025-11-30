# Development Workflow

## Branch Strategy

This project follows a clean development workflow:

- **main**: Production-ready code
- **dev**: Development branch for active work
- **feature/***: Feature branches for specific work

## Workflow

1. Create feature branches from `dev`
2. Work on features and create PRs to `dev`
3. Review and squash-merge to `dev`
4. When ready, create PR from `dev` to `main`
5. Squash-merge to `main` for clean history

## Repository Settings

- ✅ Squash merge enabled
- ✅ Merge commits disabled
- ✅ Rebase merge disabled
- ✅ Auto-delete branches after merge
- ✅ Branch protection on main

## Getting Started

```bash
# Clone the repository
git clone https://github.com/DrKhaled123/rovo-trae-new-healthy1.git
cd rovo-trae-new-healthy1

# Switch to dev branch
git checkout dev

# Start development
npm install
npm run dev
```

## Project Structure

- `frontend/`: Next.js frontend application
- `nutrition-platform/`: Backend nutrition platform
- Various data directories for nutrition, meals, workouts, etc.