# Contributing to SkySpeed Neo

We welcome contributions to SkySpeed Neo! Please follow these guidelines to ensure a smooth collaboration process.

## 🛠️ Development Workflow

1.  **Branching**: Create a new branch for your feature or fix.
    - Format: `feature/feature-name` or `fix/issue-description`
2.  **Commits**: Use conventional commits.
    - `feat:` for new features
    - `fix:` for bug fixes
    - `docs:` for documentation updates
    - `refactor:` for code restructuring
3.  **Pull Requests**: explicit description of changes and screenshot/video evidence for UI changes.

## 📐 Coding Standards

- **TypeScript**: Strict mode is enabled. No `any`.
- **Styling**: Tailwind CSS for all styling. Avoid custom CSS files unless necessary for complex animations.
- **Components**:
    - Place in `src/components/[feature]/[sub-feature]`.
    - Use functional components.
    - Ensure all props are typed.

## 🧪 Testing

- Ensure the application builds (`npm run build`) before pushing.
- Test your changes manually in both Desktop and Mobile viewports.
